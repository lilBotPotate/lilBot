const {
    Discord,
    request
} = require("../../../Imports.js");

module.exports = {
    name: "CN",
    description: {
        "info": "Chuck Norris writes code that optimizes itself",
        "uses": {
            "chucknorris": "get random Chuck Norris joke"
        }
    },
    execute(msg, args) {
        request("https://api.chucknorris.io/jokes/random", { json: true }, sendJoke);

        function sendJoke(err, res, body) {
            if (err) return console.log(err);
        
            var chuckEmbed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setTitle("**CHUCK NORRIS JOKE**")
                .setDescription(body.value)
                .setThumbnail(body.icon_url)
                .setFooter("Powered by api.chucknorris.io", "https://api.chucknorris.io/img/chucknorris_logo_coloured_small.png");
    
            msg.channel.send(chuckEmbed).catch(console.error);
        }
    }
};
