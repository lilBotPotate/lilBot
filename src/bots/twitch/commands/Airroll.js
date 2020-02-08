const {
    Command
} = require("../../../imports/Imports");

module.exports = new Command.Twitch()
      .setName("AIRROLL")
      .setInfo("Just an airrroll command")
      .addUse("airroll", "sends the message")
      .setCommand(sendAirroll);

function sendAirroll(client, channel) {
    return client.say(channel, `"I air roll now" - lilPotate 2019`);
}