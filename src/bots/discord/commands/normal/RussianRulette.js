const {
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("RR")
      .setInfo("PG friendly Russian Roulette")
      .addUse("rr {number}", "well you know how this goes")
      .setCommand(russianRulette);

function russianRulette(msg, args) {
    if(!args || args.length < 1) return msg.channel.send("Define the amount of potatoes");
    if(isNaN(args[0])) return msg.channel.send("Argument has to be a number!");

    const numPotatoes = args[0];
    if(numPotatoes >= 6) return msg.channel.send("Hey no cheating!");
    if(numPotatoes <= 0) return msg.channel.send("Whats the point then...");

    const text = `You load **${numPotatoes}** :potato: in your potato gun :scream:`;

    msg.channel.send(text).then(m => {
        const randNum = Math.floor(Math.random() * 6) + 1;
        setTimeout( function() { 
            if(randNum <= numPotatoes) m.edit(`${text}\n**BANG!** :boom: Its mashed potato time! :yum:`);
            else m.edit(`${text}\n**CLICK** :zap: No mashed potato for you! :cry:`);
        }, 3000);
    });
}