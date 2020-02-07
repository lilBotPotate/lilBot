const {
    Discord,
    request,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("MEME")
      .setInfo("Just a random meme generator")
      .addUsage("meme", "sends a random meme")
      .setCommand(sendMeme);

async function sendMeme(msg) {
    const url = "https://meme-api.herokuapp.com/gimme";
    const jMeme = await getJSON(url);

    if(!jMeme) return "Something went wrong...".sendTemporary(msg);
    
    const exampleEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**${jMeme.title}**`)
        .setURL(jMeme.postLink)
        .setImage(jMeme.url)
        .setFooter("Powered by meme-api.herokuapp.com");

    msg.channel.send(exampleEmbed);
}

function getJSON(url) {
    return new Promise(function (resolve, reject) {
        request(url, { json: true }, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}