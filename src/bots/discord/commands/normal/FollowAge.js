const {
    request
} = require("../../../../modules/Imports");

module.exports = {
    name: "FOLLOWAGE",
    description: {
        "info": "UwU how long have I been following lilPotate",
        "uses": {
            "followage {twitch username}": "get how long you have been following lilPotate"
        }
    },
    execute(msg, args) {
        if(args.length < 1) return "Missing arguments!".sendTemporary(msg);
        const username = args[0];
        return getFollowAge(msg, username);
    }
};

function getFollowAge(msg, username) {
    const options = {
        url: `https://api.2g.be/twitch/followage/lilPotate/${username}?format=mwdhms`,
        headers: {
            "User-Agent": "Discord Bot"
        }
    }

    function sendData(error, response, body) {
        const bodyArr = body.split(/ +/);
        const name = bodyArr.shift();
        msg.channel.send(
            `**${name}** ${bodyArr.join(" ")}`
        );
    }

    request(options, sendData);
}