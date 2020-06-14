const {
    Discord,
    Canvas,
    Command,
    Universal
} = require("../../../../imports/Imports");

const {
    jRocketLeague
} = require("../../../../imports/functions/Stores");

const { 
    ranks, 
    changeName, 
    validPlatforms 
} = require("../../../../db/rl_rank.json");

module.exports = new Command.Normal()
      .setName("RANK")
      .setInfo("Check your Rocket Leg rank!")
      .addUse("rank", "get lilPotate's rank")
      .addUse("rank {platform} {steam id / url name} {type}", "get rank based on the id. Platforms: `steam, ps, xbox`. Types: `card, embed, text`")
      // .addSubCommand("SET", setProfile)
      // .addSubCommand("ME", getProfile)
      .setCommand(getId);
      
/** 
 * @param {{msg: Object, args: Array<String>}}
 * @returns {void}
*/
async function setProfile(msg, args) {
    if(!args || args.length < 2) return await msg.channel.send("Missing Arguments!");
    let userId = args.shift();
    const platform = args.shift().toLowerCase();
    if(platform === "steam") userId = await await getValidId(userId);
    if(userId === null) return await msg.channel.send("That user doesn't exist!");
    if(isValidPlatform(platform)) return await msg.channel.send(`That is not a valid platform! Choose from: ${validPlatforms.join(", ")}`);
    await jRocketLeague.set(`users.${msg.author.id}.${platform}`, userId);
    return msg.channel.send(`**${platform.toUpperCase()} ID** was set for ${msg.author}!`);
}

async function getProfile(msg, args) {
    const platform = args && args.length > 0 ? await args.shift().toLowerCase() : "steam";
    if(isValidPlatform(platform)) return await msg.channel.send(`That is not a valid platform! Choose from: ${validPlatforms.join(", ")}`);
    const userId = await jRocketLeague.get(`users.${msg.author.id}.${platform}`);
    if(!userId) return await msg.channel.send(`**${await platform.toUpperCase()} ID** is not set for ${msg.author}!`);
    const userData = await getUserData({ msg, userId, platform });
    if(userData === null) return await msg.channel.send("Something went wrong with getting the data... Sorry :(");
    const { rankData, profileData } = userData;
    return await sendRankData({ msg, args, rankData, profileData });
}

async function getId(msg, args) {
    const platform = args && args.length > 0 ? await args.shift().toLowerCase() : "steam";
    if(isValidPlatform(platform)) return await msg.channel.send(`That is not a valid platform! Choose from: ${validPlatforms.join(", ")}`);
    let userId = await args.join("-");
    
    userId = !userId ? global.gConfig.extra.default_steam_id
           : platform === "steam" ? await getValidId(userId)
           : userId;
    if(userId === null) return await msg.channel.send("That user doesn't exist!");
    const userData = await getUserData({ msg, userId, platform });
    if(userData === null) return await msg.channel.send("Something went wrong with getting the data... Sorry :(");
    const { rankData, profileData } = userData;
    return await sendRankData({ msg, args, rankData, profileData });
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
    const rankData = await getRankData({ msg, userId, platform });
    if(rankData == null) return null;
    let profileData; 
    switch(platform) {
        case "steam":
            const steamCheckUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${userId}`;
            const profileJson = await Universal.getData(steamCheckUrl, { json: true });
            if(
                !profileJson || !profileJson.response || 
                !profileJson.response.players || !profileJson.response.players[0] 
            ) return null;
            
            const playerJson = profileJson.response.players[0];
            profileData = {
                steamId: playerJson.steamid,
                name: playerJson.personaname,
                avatarUrl: playerJson.avatarfull,
                url: playerJson.profileurl
            }
            break;
        case "ps":
            profileData = {
                name: userId,
                avatarUrl: "./src/files/images/rocket_league/psy.png"
            };
            break;

        case "xbox":
            profileData = {
                name: userId.replace(/-/g, " "),
                avatarUrl: "./src/files/images/rocket_league/xbox.png"
            };
            break;
        default:
            break;
    }
    return { rankData, profileData };
}

async function getRankData({ msg, userId, platform }) {
    const selectedAPI = ({
        "steam": async (userId) => await jsonKyuuAPI(userId, "steam"), 
        "ps": async (userId) => await jsonKyuuAPI(userId, "ps"), 
        "xbox": async (userId) => await jsonKyuuAPI(userId, "xbox") 
    })[platform];
    
    if(!selectedAPI) {
        msg.channel.send("Whoops something went wrong... Don't blame yourself it was me who did it :(");
        return `[ERROR]: False platform!`.sendLog();
    };

    const rankData = await selectedAPI(userId);
    if(!rankData || rankData == null || rankData == {} || !rankData["1v1"]) return null;
    return rankData;

    async function kyuuAPI(id, platform) {
        try {
            const url = `https://kyuu.moe/extra/rankapi.php?channel=lilBunane&user=${id}&plat=${platform}`;
            const data = await Universal.getData(url, { json: false });
            if(!data || data === "") return null;
            const dataArray = await data.split(" | ");
            await dataArray.shift();
            const dataJSON = { api: "kyuu.moe" };
            for await(let i of dataArray) {
                let rankArr = await i.split(": ");
                const mode = await rankArr.shift().toLowerCase();
                rankArr = await rankArr.shift().split(" (");
                const name = await rankArr.shift().toLowerCase();
                const mmr = parseInt(await rankArr.shift().replace(")", ""));
                let rank = null;
                for(let r in ranks) {
                    if(ranks[r].name === name ) { rank = parseInt(r); break; }
                }
                if(rank === null) return null;
                dataJSON[mode] = { rank, mmr };
            }
            return dataJSON;
        } catch (error) { return null; }
    }

    async function jsonKyuuAPI(id, platform) {
        try {
            const custom = "%7B%221v1%22%3A%7B%22rank%22%3A%22!1sName!%22%2C%22mmr%22%3A!1sMMR!%7D%2C%222v2%22%3A%7B%22rank%22%3A%22!2sName!%22%2C%22mmr%22%3A!2sMMR!%7D%2C%223v3%22%3A%7B%22rank%22%3A%22!3sName!%22%2C%22mmr%22%3A!3sMMR!%7D%2C%22solo%203v3%22%3A%7B%22rank%22%3A%22!Solo3sName!%22%2C%22mmr%22%3A!Solo3sMMR!%7D%2C%22dropshot%22%3A%7B%22rank%22%3A%22!DropName!%22%2C%22mmr%22%3A!DropMMR!%7D%2C%22hoops%22%3A%7B%22rank%22%3A%22!HoopsName!%22%2C%22mmr%22%3A!HoopsMMR!%7D%2C%22rumble%22%3A%7B%22rank%22%3A%22!RumbleName!%22%2C%22mmr%22%3A!RumbleMMR!%7D%2C%22snowday%22%3A%7B%22rank%22%3A%22!SnowName!%22%2C%22mmr%22%3A!SnowMMR!%7D%7D";
            const url = `https://kyuu.moe/extra/rankapi.php?channel=${id}&user=${id}&plat=${platform}&custom=${custom}`;
            let data = await Universal.getData(url, { json: true });
            if(!data || data === "" || (typeof data != "object")) return null;

            for(const rank_name in data) {
                const rank_data = data[rank_name];
                
                if(!rank_data.rank) continue;

                for(let r in ranks) {
                    if(ranks[r].name === rank_data.rank.toLowerCase()) { rank_data.rank = parseInt(r); break; }
                }
            }
            data.api = "kyuu.moe";
            return data;
        } catch (error) { return null; }
    }
    
    async function calculatedAPI(id) {
        try {
            const url = `https://calculated.gg/api/player/${id}/ranks`;
            const data = await Universal.getData(url, { json: true });
            if(!data) return null;
            dataJSON = { api: "calculated.gg" };
            for(let i in data) {
                dataJSON[changeName[i]] = { rank: data[i].rank, mmr: data[i].rating }
            }
            return dataJSON;
        } catch (error) { return null; }
    }
}

async function getIdFromUrl(urlName) {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_KEY}&vanityurl=${urlName}`;
    const jUser = await Universal.getData(url, { json: true });
    if(jUser.response.success != 1) return null;
    return jUser.response.steamid;
}

async function createImage({ msg, rankData, profileData }) {
    const iCard = await Canvas.loadImage("./src/files/images/rocket_league/card.png");
    const iRingShadow = await Canvas.loadImage("./src/files/images/rocket_league/rank_rings/shadow.png");

    const canvas = Canvas.createCanvas(iCard.width, iCard.height);
    const ctx = canvas.getContext("2d");

    const avatarImage = await Canvas.loadImage(profileData.avatarUrl);
    ctx.drawImage(avatarImage, 74, 74, 256, 256);

    ctx.drawImage(iCard, 0, 0);
    ctx.drawImage(iRingShadow, 0, 0);
    
    const rows = [
        [ "1v1", "2v2", "3v3", "solo 3v3" ],
        [ "rumble", "dropshot", "hoops", "snowday" ]
    ];

    let maxRank = 0;

    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    const rankImages = {};
    for (let i = 0; i < rows.length; i++) {
        const selectedRow = rows[i];
        for (let j = 0; j < selectedRow.length; j++) {
            const element = selectedRow[j];
            const elementData = rankData[element];
            if(elementData && !isNaN(elementData.rank)) {
                if(!rankImages[elementData.rank]) {
                    rankImages[elementData.rank] = await Canvas.loadImage(`./src/files/images/rocket_league/rank_icons/${elementData.rank}.png`);
                }
                ctx.drawImage(rankImages[elementData.rank], 458 + 224*j, 114 + 257*i, 160, 136);
                ctx.fillText(elementData.mmr, 458 + 80 + 224*j, 114 + 161 + 257*i);
                if(elementData.rank >= maxRank) maxRank = elementData.rank;
            } 
        }
    }
    
    const ringName = ranks[maxRank].ring_name ? ranks[maxRank].ring_name : "unranked";
    const iRing = await Canvas.loadImage(`./src/files/images/rocket_league/rank_rings/${ringName}.png`);
    ctx.drawImage(iRing, 0, 0);

    const today = new Date();
    const dateString = ("0" + today.getDate()).slice(-2) + '.'
                     + ("0" + (today.getMonth() + 1)).slice(-2) + '.'
                     + today.getFullYear();
    
    ctx.textAlign = "right";
    ctx.font = "bold 25px arial";
    ctx.fillText(dateString, canvas.width - 30, 45);
        
    ctx.textAlign = "left";
    ctx.font = "bold 40px arial";
    ctx.fillText(profileData.name, 40, canvas.height - 40);
    return canvas.toBuffer();
}

function sendRankData({ msg, rankData, profileData }) {
    if(!rankData) return msg.channel.send("Whoops something went wrong... Missing rank data... :(");
    if(!profileData) return msg.channel.send("Whoops something went wrong... Missing profile data... :(");
    return sendImage({ msg, rankData, profileData });
}

async function sendImage({ msg, rankData, profileData }) {
    const imageBuffer = await createImage({ msg, rankData, profileData });
    const imageAttachment = new Discord.Attachment(imageBuffer, "rank.png");
    
    const eRanks = new Discord.RichEmbed()
                .setColor("#2d51c9")
                .setTitle(`**${profileData.name.toUpperCase()}'S RANKS**`)
                .setImage("attachment://rank.png")
                .setFooter(`Powered by ${rankData.api}`, "https://rocketleague.media.zestyio.com/Rocket-League-Logo-Full_On-Dark-Horizontal.f1cb27a519bdb5b6ed34049a5b86e317.png");

    if(profileData.url) eRanks.setURL(profileData.url);

    return await msg.channel.send({ files: [imageAttachment], embed: eRanks });
}

function sendEmbed({ msg, rankData, profileData }) {
    const order = [
        "1v1", "2v2", "3v3", "solo 3v3", 
        "rumble", "dropshot", "hoops", "snowday"
    ];

    const eRanks = new Discord.RichEmbed()
        .setColor("#2d51c9")
        .setTitle(`**${(profileData.name).toUpperCase()}'S RANKS**`)
        .setFooter(`Powered by ${rankData.api}`, "https://rocketleague.media.zestyio.com/Rocket-League-Logo-Full_On-Dark-Horizontal.f1cb27a519bdb5b6ed34049a5b86e317.png");
    if(!profileData.avatarUrl.startsWith(".")) eRanks.setThumbnail(profileData.avatarUrl);
    if(profileData.url) eRanks.setURL(profileData.url);
    for(mode of order) {
        const modeRank = rankData[mode];
        const rankEmoji = global.gClientDiscord.emojis.find(emoji => emoji.name === `r${modeRank.rank}`) 
        eRanks.addField(
            `**${mode.toUpperCase()}**`,
            `${rankEmoji} **${ranks[modeRank.rank].name.toUpperCase()} (${modeRank.mmr})**`
        );
    }
    return msg.channel.send(eRanks);
}

async function sendText({ msg, rankData, profileData }) {
    const order = [
        "1v1", "2v2", "3v3", "solo 3v3", 
        "rumble", "dropshot", "hoops", "snowday"
    ];

    let rankString = `**${(profileData.name).toUpperCase()}'S RANKS**\n`;

    for(mode of order) {
        const modeRank = rankData[mode];
        rankString += `**${mode.toUpperCase()}**: ${ranks[modeRank.rank].name.toUpperCase()} (${modeRank.mmr}), `;
    }

    rankString = rankString.split(rankString.length - 2);
    return msg.channel.send(rankString);
}