const {
    Command
} = require("../../../../imports/Imports");

const punArr = require("../../../../db/puns.json");

module.exports = new Command.Normal()
      .setName("PUN")
      .setInfo("Its puntastic")
      .addUse("pun", "sends a random pun")
      .setCommand(sendPun);

function sendPun(msg) {
    const pun = punArr[Math.floor(Math.random() * punArr.length)];
    return msg.channel.send(pun);
}