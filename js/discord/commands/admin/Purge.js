module.exports = {
	name: "PURGE",
	description: {
		"info": "Begone messages!",
		"uses": {
          "purge": "deletes 25 messages from the channel",
          "purge {mention user}": "deletes 25 from mentioned user from the channel",
          "purge {amount}": "deletes the amount of messages that you specify. Max = 100",
          "purge {mention user} {amount}": "deletes the amount of messages from the user that you specify. Max = 100"
		}
	},
	execute(client, msg, args) {
        const mentionedUser = msg.mentions.users.first();
        if(mentionedUser) {
            for (let i = 0; i < args.length; i++) {
                if(!args[i].endsWith(">")) continue;
                if(args[i].startsWith("<@")) { args.splice(i, 1); i--; }
            }
        }

        let msgLimit = args[0] && !isNaN(args[0]) ? args[0] : 25;
        if(msgLimit > 100) msgLimit == 100;

        msg.channel.fetchMessages({ limit: msgLimit }).then(function(messages) {
            let userMsg = "";
            if(mentionedUser) {
                messages = messages.filter(m => m.author.id === mentionedUser.id);
                userMsg = ` from **${mentionedUser.username}**`
            }
            `Purging **${messages.size}** ${messages.size == 1 ? "message" : "messages"}${userMsg}!`.sendTemporary(msg);
            messages.forEach(message => {
                message.delete().catch();
            });
        }).catch(console.error);
	}
};
