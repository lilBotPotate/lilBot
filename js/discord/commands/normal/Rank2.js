const {
    Discord,
    request,
    Canvas
} = require("../../../Imports");

const {
    jRocketLeague
} = require("../../../Stores");

const { 
    ranks, 
    changeName, 
    validPlatforms 
} = require("../../../../json/rl_rank.json");

module.exports = {
    name: "RANK2",
    description: {
        "info": "template",
        "uses": {
            "template": "template"
        }
    },
    execute(msg, args) {
        const command = args && args.length > 0 ? args.shift().toUpperCase() : null;
        switch(command) {
            case "SET": return setProfile({ msg, args });
            case "ME": return getProfile({ msg, args });
            default: return getId({ msg, args, userId: command });
        }
    }
};

async function setProfile({ msg, args }) {
    if(!args || args.length < 2) return await msg.channel.send("Missing Arguments!");
    let userId = await getValidId(await args.shift());
    if(userId === null) return await msg.channel.send("That user doesn't exist!");
    const platform = await args.shift().toLowerCase();
    if(isValidPlatform(platform)) return await msg.channel.send(`That is not a valid platform! Choose from: ${validPlatforms.join(", ")}`);
    await jRocketLeague.set(`users.${msg.author.id}.${platform}`, userId);
    return msg.channel.send(`**${platform.toUpperCase()} ID** was set for ${msg.author}!`);
}

async function getProfile({ msg, args}) {
    const platform = args && args.length > 0 ? await args.shift().toLowerCase() : "steam";
    if(isValidPlatform(platform)) return await msg.channel.send(`That is not a valid platform! Choose from: ${validPlatforms.join(", ")}`);
    const userId = await jRocketLeague.get(`users.${msg.author.id}.${platform}`);
    if(!userId) return await msg.channel.send(`**${await platform.toUpperCase()} ID** is not set for ${msg.author}!`);
    const userData = await getUserData({ msg, userId, platform });
    if(userData === null) return await msg.channel.send("Something went wrong with getting the data... Sorry :(");
    const { rankData, profileData } = userData;
    return await sendRankData({ msg, rankData, profileData });
}

async function getId({ msg, args, userId }) {
    const platform = args && args.length > 0 ? await args.shift().toLowerCase() : "steam";
    if(isValidPlatform(platform)) return await msg.channel.send(`That is not a valid platform! Choose from: ${validPlatforms.join(", ")}`);
    userId = ! userId ? process.env.DEFAULT_STEAM_ID 
             : platform === "steam" ? await getValidId(userId)
             : userId;
    if(userId === null) return await msg.channel.send("That user doesn't exist!");
    const userData = await getUserData({ msg, userId, platform });
    if(userData === null) return await msg.channel.send("Something went wrong with getting the data... Sorry :(");
    const { rankData, profileData } = userData;
    return await sendRankData({ msg, rankData, profileData });
}

/* ------------------------------------------------- METHODS ------------------------------------------------- */
async function getValidId(userId) {
    for await(let val of userId) {
        if(isNaN(val)) return await getIdFromUrl(userId);
    }
    return userId;
}

function isValidPlatform(platform) {
    return !validPlatforms.find(pf => pf === platform);
}

async function getUserData({ msg, userId, platform }) {
    const steamCheckUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${userId}`;
    const [rankData, profileJson] = await Promise.all([
        getRankData({ msg, userId, platform }), 
        getData(steamCheckUrl, true)
    ]);
    
    if(
        !profileJson || !profileJson.response || 
        !profileJson.response.players || !profileJson.response.players[0] 
    ) return null;
    
    const playerJson = profileJson.response.players[0];

    const profileData = {
        steamId: playerJson.steamid,
        name: playerJson.personaname,
        avatarUrl: playerJson.avatarfull,
        url: playerJson.profileurl
    }
    return { rankData, profileData };
}

async function getRankData({ msg, userId, platform }) {
    const selectedAPI = ({
        "steam": async (userId) => {
            const rankData = await calculatedAPI(userId);
            if(rankData == null) return await kyuuAPI(userId, "steam");
            return rankData;
        }, 
        "ps": async (userId) => await kyuuAPI(userId, "ps"), 
        "xbox": async (userId) => await kyuuAPI(userId, "xbox") 
    })[platform];
    
    if(!selectedAPI) {
        msg.channel.send("Whoops something went wrong... Don't blame yourself it was me who did it :(");
        return `[ERROR]: False platform!`.sendLog();
    };

    const rankData = await selectedAPI(userId);
    if(rankData == null) return await msg.channel.send("Whoopsie something went wrong with getting the data...");
    return rankData;

    async function kyuuAPI(id, platform) {
        try {
            const url = `https://kyuu.moe/extra/rankapi.php?channel=${id}&user=${id}&plat=${platform}`;
            const data = await getData(url, false);
            if(!data || data === "") return null;
            const dataArray = await data.split(" | ");
            await dataArray.shift();
            const dataJSON = { api: "kyuu.moe" };
            for await(let i of dataArray) {
                let rankArr = await i.split(": ");
                const mode = await rankArr.shift().toLowerCase();
                rankArr = await rankArr.shift().split(" (");
                const name = await rankArr.shift().toLowerCase();
                const mmr = await rankArr.shift().replace(")", "");
                let rank = null;
                for(let r in ranks) {
                    if(ranks[r].name === name ) { rank = r; break; }
                }
                if(rank === null) return null;
                dataJSON[mode] = { rank, mmr };
            }
            return dataJSON;
        } catch (error) { return null; }
    }
    
    async function calculatedAPI(id) {
        try {
            const url = `https://calculated.gg/api/player/${id}/ranks`;
            const data = await getData(url, true);
            if(!data) return null;
            dataJSON = { api: "calculated.gg" };
            for(let i in data) {
                dataJSON[changeName[i]] = { rank: data[i].rank, mmr: data[i].rating }
            }
            return dataJSON;
        } catch (error) { return null; }
    }
}

function getData(url, json) {
    return new Promise(function (resolve, reject) {
        request(url, { json }, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}

async function getIdFromUrl(urlName) {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_KEY}&vanityurl=${urlName}`;
    const jUser = await getData(url, true);
    if(jUser.response.success != 1) return null;
    return jUser.response.steamid;
}

async function createImage({ rankData, profileData }) {
    const canvas = Canvas.createCanvas(1000, 1000);
    const ctx = canvas.getContext("2d");
    const avatarImage = await Canvas.loadImage(profileData.avatarUrl);
    ctx.drawImage(avatarImage, 0, 0, 200, 200);
    return canvas.toBuffer();
}

async function sendImage({ msg, rankData, profileData }) {
    const imageBuffer = await createImage({ rankData, profileData });
    const imageAttachment = new Discord.Attachment(imageBuffer, "rank.png");
    
    const eRank = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setImage("attachment://rank.png");

    await msg.channel.send({ files: [imageAttachment], embed: eRank });
}

async function sendRankData({ msg, rankData, profileData }) {
    await msg.channel.send("```json\n" + JSON.stringify(rankData, null, 2) + "```");
    return await sendImage({ msg, rankData, profileData });
}