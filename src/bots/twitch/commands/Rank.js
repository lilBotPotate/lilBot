const {
    request
} = require("../../Imports.js");

module.exports = {
    name: "RANK2",
    execute(client, channel, tags, args, self) {
        const name = args.length < 1 ? "76561198205508836" : args[0];
        return sendRand(client, channel, name);
    }
};

async function sendRand(client, channel, name) {
    const url = `http://kyuu.moe/extra/rankapi.php?channel=lilPotate&user=${name}&plat=steam`;
    const data = await getData(url);
    await client.say(channel, data);
}

function getData(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}