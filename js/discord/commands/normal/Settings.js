const {
    Discord
} = require("../../../Imports.js");

module.exports = {
    name: "SETTINGS",
    description: {
        "info": "Pro rocket league settings",
        "uses": {
            "settings": "get the potato settings"
        }
    },
    execute(client, msg, args) {
        const jInfo = require("../../../../json/info.json");

        let settingsList = "";
        for(i in jInfo.settings) settingsList += `**${i.toUpperCase()}:** ${jInfo.settings[i]}\n`

        const eSettings = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("**SETTINGS**")
            .setDescription(settingsList);

        msg.channel.send(eSettings);
    }
};