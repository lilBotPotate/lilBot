const {
    Discord,
    Command 
} = require("../../../../imports/Imports");

const jInfo = require("../../../../files/json/info.json");

module.exports = new Command.Normal()
      .setName("SOCIALS")
      .setInfo("Where can I find lilPotate?")
      .addUse("socials", "tells you where lilPotate is hiding")
      .setCommand(sendSocials);

function sendSocials(msg) {
    let socialsList = "";
    for(i in jInfo.socials) socialsList += `**${i.toUpperCase()}:** ${jInfo.socials[i]}\n`
    let teamList = "";
    for(i in jInfo.team) teamList += `**${i.toUpperCase()}:** ${jInfo.team[i]}\n`

    const eSocials = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("**LILPOTATE**")
          .setDescription(socialsList)
          .addField("**TEAM SENTINEL**", teamList);

    return msg.channel.send(eSocials);
}