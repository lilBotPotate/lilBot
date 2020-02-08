const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("DOG")
      .setInfo("I mean... Who doesn't love dogs :heart:")
      .addUse("dog", "sends a random dog image")
      .setCommand(sendDogImage);
      
async function sendDogImage(msg) {
    const jImage = await Universal.getData("https://api.thedogapi.com/v1/images/search", { json: true });
    if(!jImage) return Universal.sendTemporary(msg, "Something went wrong...");
    const exampleEmbed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setImage(jImage[0].url)
          .setFooter("Powered by thedogapi.com", "https://cdn2.thedogapi.com/logos/wave-square_256.png");
    return msg.channel.send(exampleEmbed);
}