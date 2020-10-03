const {
    Command 
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("RANDOM")
      .setInfo("Returns a random value that you inputed")
      .addUse("random {value}, ..., {value}", "get the potato settings")
      .setCommand(sendRandom);

function sendRandom(msg, args) {
    const values = args.join(" ").split(/,+/) || [];
    const random_value = values[Math.floor(Math.random() * values.length)];
    if(random_value && random_value !== "") return msg.channel.send(`Selected value: **${random_value}**`);
    return msg.channel.send("You need to input some values!");
}