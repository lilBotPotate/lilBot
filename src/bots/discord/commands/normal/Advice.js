const {
    request,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("ADVICE")
      .setInfo("Life advice by lilBot")
      .addUse("advice", "gives you an advice")
      .addUse("advice {mention}", "gives that user an advice")
      .setCommand(sendAdvice);

async function sendAdvice(msg) {
    const jAdvice = await JSON.parse(await Universal.getData("https://api.adviceslip.com/advice", { json: false }));
    const mention = msg.mentions.users.first();
    return msg.channel.send(`${mention ? `${mention} ` : ""}${jAdvice.slip.advice}`);
}