const {
    Discord
} = require("../../../../Imports.js");

module.exports = function(msg, args, trainer) {
    const item = args[0] ? args.shift().toLowerCase() : null;
    const amount = args[0] && !isNaN(args[0]) ? parseInt(args.shift()) : 1;
    if(item == null) return msg.channel.send("You need to specify which item you want to buy!");

    const items = {
        "pokeball": 10,
        "potion": 20
    }
    const price = items[item] * amount;
    if(!price) return msg.channel.send("You can't buy that item...");
    
    const coins = trainer.get("coins");
    if(price > coins) return msg.channel.send("You don't have enough coins...");
    const itemCount = trainer.get(`${item}s`);
    trainer.set("coins", coins - price);
    trainer.set(`${item}s`, itemCount + amount);

    const eBuy = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("You just bought:")
        .setDescription(`${amount} ${item}${amount > 1 ? "s" : ""}`);
    
    return msg.channel.send(eBuy);
};