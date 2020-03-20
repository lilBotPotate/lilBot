const {
    Command
} = require("../../../../imports/Imports");

const roastsArr = require("../../../../db/roasts.json");

module.exports = new Command.Normal()
      .setName("ROAST")
      .setInfo("Everybody likes BBQ")
      .addUse("roast {tag}", "roast tagged user")
      .setCommand(roast);

function roast(msg) {
    const mentionedUser = msg.mentions.users.first();
    const userID = mentionedUser ? mentionedUser.id : msg.author.id;
    const roast = roastsArr[Math.floor(Math.random() * roastsArr.length)];
    return msg.channel.send(`<@${userID}>, ${roast}`);
}