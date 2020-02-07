const {
    Discord,
    request,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("DOG")
      .setInfo("I mean... Who doesn't love dogs :heart:")
      .addUsage("dog", "sends a random dog image")
      .setCommand(sendDogImage);
      
async function sendDogImage(msg) {
    const url = "https://api.thedogapi.com/v1/images/search";
    const jImage = await getJSON(url);

    if(!jImage) return "Something went wrong...".sendTemporary(msg);
    
    const exampleEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(jImage[0].url)
        .setFooter("Powered by thedogapi.com", "https://cdn2.thedogapi.com/logos/wave-square_256.png");

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