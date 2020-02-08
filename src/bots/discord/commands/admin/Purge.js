const {
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("PURGE")
      .setInfo("Begone messages!")
      .addUse("purge", "deletes 25 messages from the channel")
      .addUse("purge {mention user}", "deletes 25 from mentioned user from the channel")
      .addUse("purge {amount}", "deletes the amount of messages that you specify. Max = 100")
      .addUse("purge {mention user} {amount}", "deletes the amount of messages from the user that you specify. Max = 100")
      .setCommand(purgeMessages)
      .disable("Broken");
      
function purgeMessages(msg, args) {
    const mentionedUser = msg.mentions.users.first();

    if(mentionedUser) {
        for (let i = 0; i < args.length; i++) {
            if(args[i].match(/^<@!?(\d+)>$/) != null) { args.splice(i, 1); i--; }
        }
    }

    let msgLimit = args[0] && !isNaN(args[0]) ? args[0] : 25;
    if(msgLimit > 100) msgLimit = 100;

    msg.channel.fetchMessages({ limit: msgLimit }).then(function(messages) {
        let userMsg = "";
        if(mentionedUser) {
            messages = messages.filter(m => m.author.id === mentionedUser.id);
            userMsg = ` from **${mentionedUser.username}**`
        }
        `Purging **${messages.size}** ${messages.size == 1 ? "message" : "messages"}${userMsg}!`.sendTemporary(msg);
        messages.forEach(m => { m.delete(); });
    }).catch(console.error);
}
