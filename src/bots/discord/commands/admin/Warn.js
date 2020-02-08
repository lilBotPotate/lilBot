const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("WARN")
      .setInfo("Someone is being bad")
      .addUse("warn {tag} {reason}", "warn the tagged user")
      .setCommand(warnUser);

function warnUser(msg, args) {
    if(!msg.mentions.members.first()) return Universal.sendTemporary(msg, "You need to tag the person you want to warn them!");
    const warnedMember = msg.mentions.members.first();
    args.shift();
    const reason = args.join(" ");
    if(!reason) return Universal.sendTemporary("You need to give a reason");
    

    const eWarn = new Discord.RichEmbed()
          .setColor("#e6c319")
          .setThumbnail(warnedMember.user.avatarURL)
          .setTitle(`**${warnedMember.user.tag}** was **WARNED**`)
          .setDescription(reason)
          .setFooter(msg.author.username, msg.author.avatarURL);

    msg.channel.send(eWarn).then(m => {
        msg.delete();
    });

    if(!warnedMember.user.bot) return warnedMember.send(eWarn);
}