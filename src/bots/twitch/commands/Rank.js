const {
    Command,
    Universal
} = require("../../../imports/Imports.js");

module.exports = new Command.Twitch()
      .setName("RANK2")
      .setInfo("Ranks for days boii")
      .addUse("rank2", "get lilPotate's ranks")
      .setCommand(sendRand);

module.exports = {
    name: "",
    execute(client, channel, tags, args, self) {

        return sendRand(client, channel, name);
    }
};

async function sendRand(client, channel) {
    const name = !args || args.length < 1 ? "76561198205508836" : args.shift();
    const url = `http://kyuu.moe/extra/rankapi.php?channel=lilPotate&user=${name}&plat=steam`;
    const data = await Universal.getData(url, { json: false });
    await client.say(channel, data);
}