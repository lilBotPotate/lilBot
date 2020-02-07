const {
    Discord,
    Command 
} = require("../../../../imports/Imports");

const jInfo = require("../../../../files/json/info.json");

module.exports = new Command.Normal()
      .setName("SETTINGS")
      .setInfo("Pro rocket league settings")
      .addUsage("settings", "get the potato settings")
      .setCommand(sendSettings);

function sendSettings(msg) {
    let settingsList = "";
    for(i in jInfo.settings) settingsList += `**${i.toUpperCase()}:** ${jInfo.settings[i]}\n`

    const eSettings = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("**SETTINGS**")
        .setDescription(settingsList);

    msg.channel.send(eSettings);
}