const {
    Discord,
    request
} = require("../../../Imports.js");

const { steam_key } = require("../../../../config.json");

module.exports = {
    name: "RANK",
    description: {
        "info": "Im a GC stuck in Plat",
        "uses": {
            "rank": "get lilPotate's rank",
            "rank {steam ID}": "get rank based on the steam ID"
        }
    },
    execute(client, msg, args) {
        const potateID = "76561198205508836";
        if(args.length < 1) return sendRank(client, msg, potateID);
        if(!isNaN(args[0])) return sendRank(client, msg, args[0]);
        const name = args[0];
        return checkName(client, msg, name);
    }
};

async function checkName(client, msg, name) {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steam_key}&vanityurl=${name}`;
    const jID = await getJSON(url);
    if(jID.response.success != 1) return await msg.channel.send("That user doesn't exist!");
    return await sendRank(client, msg, jID.response.steamid);
}

async function sendRank(client, msg, steamID) {
    const order = [
        "standard", "doubles", "duel", "solo", 
        "rumble", "dropshot", "hoops", "snowday"
    ];
    
    let ranksJSON, profileJSON;
    try {
        ranksJSON = await getJSON(`https://calculated.gg/api/player/${steamID}/ranks`);
        profileJSON = await getJSON(`https://calculated.gg/api/player/${steamID}/profile`);
    } catch(error) { "[Error]: False Steam ID".sendLog(); }

    if(!ranksJSON) return msg.channel.send("That user doesn't exist!");
    else if(!profileJSON) return msg.channel.send("That user doesn't exist!");

    const eRanks = await new Discord.RichEmbed()
        .setColor("#0099ff")
        .setTitle(`**${(profileJSON.name).toUpperCase()}**`)
        .setURL(profileJSON.profileLink)
        .setThumbnail(`${profileJSON.avatarLink}`)
        .setFooter("Powered by calculated.gg", "https://pbs.twimg.com/profile_images/1138967093703921664/QvAS48No_400x400.png");

    for(mode of order) {
        const sRank = ranksJSON[mode];
        const rankEmoji = client.emojis.find(emoji => emoji.name === `r${sRank.rank}`) 
        
        await eRanks.addField(
            `**${mode.toUpperCase()} (${sRank.rating})**`,
            `${rankEmoji} **${sRank.name}**`
        );
    }
    await msg.channel.send(eRanks);
}

function getJSON(url) {
    return new Promise(function (resolve, reject) {
        request(url, { json: true }, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}