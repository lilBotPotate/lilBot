const {
    request,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("FOLLOWAGE")
      .setInfo("UwU how long have I been following lilPotate")
      .addUsage("followage {twitch username}", "get how long you have been following lilPotate")
      .setCommand(getFollowAge);

function getFollowAge(msg, args) {
    if(args.length < 1) return Universal.sendTemporary(msg, "Missing arguments!");
    const username = args[0];

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