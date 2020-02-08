const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("BAN")
      .setInfo("Someone was naughty I see :imp:")
      .addUse("ban {tag} {reason}", "bans the user")
      .setCommand(banUser);

function banUser(msg, args) {
    if(!msg.mentions.members.first()) return Universal.sendTemporary(msg, "You need to mention the user you want to ban!");
    const bannedMember = msg.mentions.members.first();
    args.shift();
    const reason = args.join(" ");
    if(!reason) return Universal.sendTemporary(msg, "You need to give a reason why you want to ban that user");
    const eBan = new Discord.RichEmbed()
               .setColor("#ff0000")
               .setThumbnail(bannedMember.user.avatarURL)
               .setTitle(`**${bannedMember.user.tag}** was **BANNED**`)
               .setDescription(reason)
               .setFooter(msg.author.username, msg.author.avatarURL);
    msg.channel.send(eBan).then(m => {
        msg.delete();
        bannedMember.ban();
    });
    if(!bannedMember.user.bot) return bannedMember.send(eBan);
}