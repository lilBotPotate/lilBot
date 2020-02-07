const {
    request,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("ADVICE")
      .setInfo("Life advice by lilBot")
      .addUsage("advice", "gives you an advice")
      .addUsage("advice {mention}", "gives that user an advice")
      .setCommand(sendAdvice);

async function sendAdvice(msg) {
    const jAdvice = await JSON.parse(await getJSON("https://api.adviceslip.com/advice"));
    const mention = msg.mentions.users.first();
    return msg.channel.send(`${mention ? `${mention} ` : ""}${jAdvice.slip.advice}`);
}

function getJSON(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode === 200) resolve(body);
            else reject(error);
        });
    });
}