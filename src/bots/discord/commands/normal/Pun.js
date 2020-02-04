const punArr = require("../../../../json/puns.json");

module.exports = {
    name: "PUN",
    description: {
        "info": "Its puntastic",
        "uses": {
            "pun": "sends a random pun"
        }
    },
    execute(msg, args) {
        const pun = punArr[Math.floor(Math.random() * punArr.length)];
        return msg.channel.send(pun);
    }
};