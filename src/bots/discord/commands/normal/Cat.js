const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("CAT")
      .setInfo("I mean... Who doesn't love cats :heart:")
      .addUse("cat", "sends a random cat image")
      .setCommand(sendCatImage);

async function sendCatImage(msg) {
    const jImage = await Universal.getData("https://api.thecatapi.com/v1/images/search", { json: true });
    if(!jImage) return Universal.sendTemporary(msg, "Something went wrong...");
    const exampleEmbed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setImage(jImage[0].url)
          .setFooter("Powered by thecatapi.com", "https://cdn2.thecatapi.com/logos/thecatapi_256xW.png");
    return msg.channel.send(exampleEmbed);
}