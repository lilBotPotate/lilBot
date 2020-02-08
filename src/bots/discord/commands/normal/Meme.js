const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("MEME")
      .setInfo("Just a random meme generator")
      .addUse("meme", "sends a random meme")
      .setCommand(sendMeme);

async function sendMeme(msg) {
    const jMeme = await Universal.getData("https://meme-api.herokuapp.com/gimme", { json: true });
    if(!jMeme) return Universal.sendTemporary(msg, "Something went wrong...");
    const exampleEmbed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle(`**${jMeme.title}**`)
          .setURL(jMeme.postLink)
          .setImage(jMeme.url)
          .setFooter("Powered by meme-api.herokuapp.com");
    return msg.channel.send(exampleEmbed);
}