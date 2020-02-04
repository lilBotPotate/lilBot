const {
    Discord
} = require("../../../Imports.js");

const jInfo = require("../../../../json/info.json");

module.exports = {
    name: "SETTINGS",
    description: {
        "info": "Pro rocket league settings",
        "uses": {
            "settings": "get the potato settings"
        }
    },
    execute(msg, args) {
        let settingsList = "";
        for(i in jInfo.settings) settingsList += `**${i.toUpperCase()}:** ${jInfo.settings[i]}\n`

        const eSettings = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("**SETTINGS**")
            .setDescription(settingsList);

        msg.channel.send(eSettings);
    }
};