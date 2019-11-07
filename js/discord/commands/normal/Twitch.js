const {
    Discord,
    request
} = require("../../../Imports.js");

const { client_id } = require("../../../../config.json");

module.exports = {
    name: "TWITCH",
    description: {
        "info": "Twitch > Mixer",
        "uses": {
            "twitch": "get lilPotate's status",
            "twitch {username}": "get defined users status"
        }
    },
    execute(client, msg, args) {
        const channel = args[0] ? args[0] : "lilpotate";
        sendData(msg, channel);
    }
};

async function sendData(msg, channel) {
    let jUser = await getJSON(`https://api.twitch.tv/helix/users?login=${channel}`);
    if(jUser.data.length < 1) return msg.channel.send("That channel doesn't exist!");
    jUser = jUser.data[0];

    let jStream = await getJSON(`https://api.twitch.tv/helix/streams?user_login=${channel}`);

    const eStream = new Discord.RichEmbed();
    let isOnline = false;

    if(jStream.data.length > 0) {
        isOnline = true;
        jStream = jStream.data[0];
    }

    eStream.setColor(`${isOnline ? "#00ff00" : "#696969"}`)
           .setTitle(`**${isOnline ? jStream.title : `${jUser.display_name} is offline`}**`)
           .setURL(`https://www.twitch.tv/${channel}`)
           .setThumbnail(jUser.profile_image_url)
           .setImage(`${isOnline ? jStream.thumbnail_url.replace("{width}x{height}", "1920x1080") : jUser.offline_image_url}`);

    if(isOnline) {
        let jGame = await getJSON(`https://api.twitch.tv/helix/games?id=${jStream.game_id}`);
        jGame = jGame.data[0];
        eStream.addField("**GAME**", jGame.name, true)
               .addField("**Viewers**", jStream.viewer_count, true);
    }

    await msg.channel.send(eStream);
}

function getJSON(url) {
    return new Promise(function (resolve, reject) {
        request({
            headers: { "Client-ID": client_id },
            uri: url,
            method: "GET",
            json: true
        }, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}