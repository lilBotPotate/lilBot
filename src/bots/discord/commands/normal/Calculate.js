const {
    Discord,
    request,
    Command,
    Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("CALC")
      .setInfo(":nerd: Math is fun!")
      .addUse("calc {expression}", "calculate the expression")
      .setCommand(sendResult);

async function sendResult(msg, args) {
    if(!args || args.length < 1) return await msg.channel.send("Missing expression!");
    const expression = await args.join(" ");
    const encodedExpression = encodeURIComponent(expression);
    const result = await Universal.getData(`https://api.mathjs.org/v4/?expr=${encodedExpression}&precision=5`, { json: false });
    const calcEmbed = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("**" + await expression.toUpperCase() + "**")
          .setDescription(`**RESULT:** ${result}`)
          .setFooter("Powered by api.mathjs.org", "https://api.mathjs.org/mathjs_330x100.png");
    return await msg.channel.send(calcEmbed);
}