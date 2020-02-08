const {
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("FOLLOWAGE")
      .setInfo("UwU how long have I been following lilPotate")
      .addUse("followage {twitch username}", "get how long you have been following lilPotate")
      .setCommand(getFollowAge);

async function getFollowAge(msg, args) {
    if(!args || args.length < 1) return Universal.sendTemporary(msg, "Missing arguments!");
    const username = await args.shift();
    const jFollowAge = await Universal.getData(
        `https://api.2g.be/twitch/followage/lilPotate/${username}?format=mwdhms`,
        {
            json: false, 
            headers: { "User-Agent": "Discord Bot" }
        }
    )
    const faArr = await jFollowAge.split(/ +/);
    return await msg.channel.send(`**${await faArr.shift()}** ${await faArr.join(" ")}`);
}