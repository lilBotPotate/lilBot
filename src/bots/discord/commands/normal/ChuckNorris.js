const {
    Discord,
    request,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("CN")
      .setInfo("Chuck Norris writes code that optimizes itself")
      .addUsage("cn", "get random Chuck Norris joke")
      .setCommand(sendJoke);

function sendJoke(msg) {
    return request(
        "https://api.chucknorris.io/jokes/random", 
        { json: true }, (err, res, body) => {
        if (err) return console.log(err);
    
        var chuckEmbed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("**CHUCK NORRIS JOKE**")
            .setDescription(body.value)
            .setThumbnail(body.icon_url)
            .setFooter("Powered by api.chucknorris.io", "https://api.chucknorris.io/img/chucknorris_logo_coloured_small.png");

        msg.channel.send(chuckEmbed).catch(console.error);
    });
}
