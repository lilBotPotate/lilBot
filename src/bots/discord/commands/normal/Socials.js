const {
    Discord
} = require("../../../Imports.js");

module.exports = {
    name: "SOCIALS",
    description: {
        "info": "Where can I find lilPotate?",
        "uses": {
            "socials": "tells you where lilPotate is hiding"
        }
    },
    execute(msg, args) {
        const jInfo = require("../../../../json/info.json");

        let socialsList = "";
        for(i in jInfo.socials) socialsList += `**${i.toUpperCase()}:** ${jInfo.socials[i]}\n`
        let teamList = "";
        for(i in jInfo.team) teamList += `**${i.toUpperCase()}:** ${jInfo.team[i]}\n`

        const eSocials = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("**LILPOTATE**")
            .setDescription(socialsList)
            .addField("**TEAM SENTINEL**", teamList);

        msg.channel.send(eSocials);
    }
};