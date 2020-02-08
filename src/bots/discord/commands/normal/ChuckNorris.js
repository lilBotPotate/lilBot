const {
    Discord,
    request,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("CN")
      .setInfo("Chuck Norris writes code that optimizes itself")
      .addUse("cn", "get random Chuck Norris joke")
      .setCommand(sendJoke);

async function sendJoke(msg) {
    const data = await Universal.getData("https://api.chucknorris.io/jokes/random", { json: true });
    const chuckEmbed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("**CHUCK NORRIS JOKE**")
          .setDescription(data.value)
          .setThumbnail(data.icon_url)
          .setFooter("Powered by api.chucknorris.io", "https://api.chucknorris.io/img/chucknorris_logo_coloured_small.png");
    return await msg.channel.send(chuckEmbed);
}
