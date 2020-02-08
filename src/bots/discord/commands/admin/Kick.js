const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("KICK")
      .setInfo("Byeee bad person")
      .addUse("kick {tag} {reason}", "kicks the tagged user")
      .setCommand(kickUser);

function kickUser(msg, args) {
    if(!msg.mentions.members.first()) return Universal.sendTemporary(msg, "You need to tag the person you want to kick!");
    const kickedMember = msg.mentions.members.first();
    args.shift();
    const reason = args.join(" ");
    if(!reason) return Universal.sendTemporary(msg, "You need to give a reason");
    const eKick = new Discord.RichEmbed()
                .setColor("#f5a742")
                .setThumbnail(kickedMember.user.avatarURL)
                .setTitle(`**${kickedMember.user.tag}** was **KICKED**`)
                .setDescription(reason)
                .setFooter(msg.author.username, msg.author.avatarURL);
        
    msg.channel.send(eKick).then(m => {
        msg.delete();
        kickedMember.kick();
    });

    if(!kickedMember.user.bot) return kickedMember.send(eKick);
}