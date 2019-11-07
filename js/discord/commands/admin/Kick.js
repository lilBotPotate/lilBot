const {
    Discord
} = require("../../../Imports.js");

module.exports = {
    name: "KICK",
    description: {
        "info": "Byeee bad person",
        "uses": {
            "kick {tag} {reason}": "kicks the tagged user"
        }
    },
    execute(client, msg, args) {
        if(!msg.mentions.members.first()) return "You need to tag the person you want to kick!".sendTemporary(msg);
        const kickedMember = msg.mentions.members.first();
        args.shift();
        const reason = args.join(" ");
        if(!reason) return "You need to give a reason".sendTemporary(msg);
        

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

        kickedMember.send(eKick);
    }
};