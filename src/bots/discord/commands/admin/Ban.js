const {
    Discord,
    Command 
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("BAN")
      .setInfo("Someone was naughty I see :imp:")
      .addUsage("ban {tag} {reason}", "bans the user")
      .setCommand(banUser);

function banUser(msg, args) {
    if(!msg.mentions.members.first()) return "You need to tag the person you want to ban!".sendTemporary(msg);
    const bannedMember = msg.mentions.members.first();
    args.shift();
    const reason = args.join(" ");
    if(!reason) return "You need to give a reason".sendTemporary(msg);
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
    if(!bannedMember.user.bot) bannedMember.send(eBan);
}