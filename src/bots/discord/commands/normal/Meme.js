const {
    Discord,
    request
} = require("../../../../modules/Imports");

module.exports = {
    name: "MEME",
    description: {
        "info": "Just a random meme generator",
        "uses": {
            "meme": "sends a random meme"
        }
    },
    execute(msg, args) { return sendMeme(msg); }
};

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