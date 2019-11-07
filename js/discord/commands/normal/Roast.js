const roastsArr = require("../../../../json/roasts.json");

module.exports = {
    name: "ROAST",
    description: {
        "info": "Everybody likes BBQ",
        "uses": {
            "roast {tag}": "roast tagged user"
        }
    },
    execute(client, msg, args) {
        const mentionedUser = msg.mentions.users.first();
        const userID = mentionedUser ? mentionedUser.id : msg.author.id;
        const roast = roastsArr[Math.floor(Math.random() * roastsArr.length)];
        msg.channel.send(`<@${userID}>, ${roast}`);
    }
};