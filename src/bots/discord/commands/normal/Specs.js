const {
    Discord,
    Command
} = require("../../../../imports/Imports");

const jInfo = require("../../../../files/json/info.json");

module.exports = new Command.Normal()
      .setName("SPECS")
      .setInfo("We want potato PC specs!")
      .addUse("specs", "get the potato PC specs")
      .setCommand(sendSpecs);

function sendSpecs(msg) {
    let specsList = "";
    for(i in jInfo.specs) specsList += `**${i.toUpperCase()}:** ${jInfo.specs[i]}\n`

    const eSpecs = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("**SPECS**")
          .setDescription(specsList);

    return msg.channel.send(eSpecs);
}