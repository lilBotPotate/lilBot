const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

const headers = { "Client-ID": process.env.TWITCH_CLIENT_ID };

module.exports = new Command.Normal()
      .setName("TWITCH")
      .setInfo("Twitch > Mixer")
      .addUse("twitch", "get lilPotate's status")
      .addUse("twitch {username}", "get defined users status")
      .setCommand(sendData);

async function sendData(msg, args) {
    const channel = args[0] ? args[0] : "lilpotate";
    let jUser = await Universal.getData(`https://api.twitch.tv/helix/users?login=${channel}`, { json: true, headers });
    if(jUser.data.length < 1) return msg.channel.send("That channel doesn't exist!");
    jUser = jUser.data[0];

    let jStream = await Universal.getData(`https://api.twitch.tv/helix/streams?user_login=${channel}`, { json: true, headers });

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
        let jGame = await Universal.getData(`https://api.twitch.tv/helix/games?id=${jStream.game_id}`, { json: true, headers });
        jGame = jGame.data[0];
        eStream.addField("**GAME**", jGame.name, true)
               .addField("**Viewers**", jStream.viewer_count, true);
    }

    return await msg.channel.send(eStream);
}