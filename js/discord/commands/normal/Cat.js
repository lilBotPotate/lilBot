const {
    Discord,
    request
} = require("../../../Imports.js");

module.exports = {
    name: "CAT",
    description: {
        "info": "I mean... Who doesn't love cats :heart:",
        "uses": {
            "cat": "sends a random cat image"
        }
    },
    execute(client, msg, args) {
        return sendImage(msg);
    }
};

async function sendImage(msg) {
    const url = "https://api.thecatapi.com/v1/images/search";
    const jImage = await getJSON(url);

    if(!jImage) return "Something went wrong...".sendTemporary(msg);
    
    const exampleEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(jImage[0].url)
        .setFooter("Powered by thecatapi.com", "https://cdn2.thecatapi.com/logos/thecatapi_256xW.png");

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