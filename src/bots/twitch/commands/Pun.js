const {
    Command
} = require("../../../imports/Imports");

const punArr = require("../../../files/json/puns.json");

module.exports = new Command.Twitch()
      .setName("PUN")
      .setInfo("We all love puns!")
      .addUse("pun", "sends a random pun")
      .setCommand(sendPun);

function sendPun(client, channel) {
    const pun = punArr[Math.floor(Math.random() * punArr.length)];
    return client.say(channel, pun);
}