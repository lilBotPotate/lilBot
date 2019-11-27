const {
    Discord
} = require("../../../Imports.js");

module.exports = {
    name: "WARN",
    description: {
        "info": "Someone is being bad",
        "uses": {
            "warn {tag} {reason}": "warn the tagged user"
        }
    },
    execute(msg, args) {
        if(!msg.mentions.members.first()) return "You need to tag the person you want to warn them!".sendTemporary(msg);
        const warnedMember = msg.mentions.members.first();
        args.shift();
        const reason = args.join(" ");
        if(!reason) return "You need to give a reason".sendTemporary(msg);
        

        const eWarn = new Discord.RichEmbed()
            .setColor("#e6c319")
            .setThumbnail(warnedMember.user.avatarURL)
            .setTitle(`**${warnedMember.user.tag}** was **WARNED**`)
            .setDescription(reason)
            .setFooter(msg.author.username, msg.author.avatarURL);

        msg.channel.send(eWarn).then(m => {
            msg.delete();
        });

        if(!warnedMember.user.bot) warnedMember.send(eWarn);
    }
};