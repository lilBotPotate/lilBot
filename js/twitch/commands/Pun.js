module.exports = {
    name: "PUN",
    execute(client, channel, tags, args, self) {
        const punArr = require("../../../json/puns.json");
        const pun = punArr[Math.floor(Math.random() * punArr.length)];
        client.say(channel, pun);
    }
};