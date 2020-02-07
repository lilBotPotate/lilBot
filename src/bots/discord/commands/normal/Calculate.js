const {
    Discord,
    request,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("CALC")
      .setInfo(":nerd: Math is fun!")
      .addUsage("calc {expression}", "calculate the expression")
      .setCommand(sendResult);

function sendResult(msg, args) {
    if(!args[0]) return msg.channel.send("Missing expression!");
    const expression = args.join(" ");
    const encodedExpression = encodeURIComponent(expression);
    request(`https://api.mathjs.org/v4/?expr=${encodedExpression}&precision=5`, 
        function (error, response, body) {
            const calcEmbed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setTitle("**" + expression.toUpperCase() + "**")
                .setDescription(`**RESULT:** ${body}`)
                .setFooter("Powered by api.mathjs.org", "https://api.mathjs.org/mathjs_330x100.png");
            msg.channel.send(calcEmbed);
        }
    ); 
}