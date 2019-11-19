const punArr = require("../../../json/puns.json");

module.exports = {
    name: "PUN",
    execute(client, channel, tags, args, self) {
        const pun = punArr[Math.floor(Math.random() * punArr.length)];
        client.say(channel, pun);
    }
};