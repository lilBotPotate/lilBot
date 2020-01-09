const {
    Discord
} = require("../../../Imports.js");

module.exports = {
    name: "WINNER",
    description: {
        "info": "Ohhhh whats the prize going to be :o",
        "uses": {
            "winner": "select a random person on the server",
            "winner subs": "select a random subscriber on the server"
        }
    },
    execute(msg, args) {
        const onlySubs = args.length > 0 ? args.shift().toUpperCase() === "SUBS" : false;
        const members = msg.guild.members
        .filter(member => {
            const subsCheck = onlySubs
                            ? member.roles.has(global.gConfig.subscriber_role)
                            : true;
            return (member.id !== msg.author.id) && !member.user.bot && subsCheck
        })
        .map(member => member.user);

        const winner = members[members.length * Math.random() | 0];
        const eWinner = new Discord.RichEmbed()
                        .setColor("#e5c100")
                        .setTitle(`**${winner.username}** is the **WINNER**!`)
                        .setDescription("Congrats! You are the chosen one!")
                        .setThumbnail(winner.avatarURL);
        msg.channel.send(`${winner} `, {embed: eWinner});
    }
};