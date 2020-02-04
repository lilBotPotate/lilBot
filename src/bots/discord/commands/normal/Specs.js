const {
    Discord
} = require("../../../Imports.js");

module.exports = {
    name: "SPECS",
    description: {
        "info": "We want potato PC specs!",
        "uses": {
            "specs": "get the potato PC specs"
        }
    },
    execute(msg, args) {
        const jInfo = require("../../../../json/info.json");

        let specsList = "";
        for(i in jInfo.specs) specsList += `**${i.toUpperCase()}:** ${jInfo.specs[i]}\n`

        const eSpecs = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("**SPECS**")
            .setDescription(specsList);

        msg.channel.send(eSpecs);
    }
};