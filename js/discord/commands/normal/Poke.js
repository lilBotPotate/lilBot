const {
    Store
} = require("../../../Imports.js");

const def_setup = {
    "pokeballs": 10,
    "coins": 100,
    "potions": 5
}

module.exports = {
    name: "POKE",
    description: {
        "info": "Gotta Catch 'Em All!",
        "uses": {
            "poke": "catch a pokemon"
        }
    },
    execute(client, msg, args) {
        if(!client.pokemon.has(msg.author.id)) setUpUser(client, msg.author.id);

        const trainer = client.pokemon.get(msg.author.id);

        const command = args[0] ? args.shift().toUpperCase() : null;
        switch(command) {
            case "CATCH":       return require("./poke/Catch.js")(msg, trainer);
            case "BUY":         return require("./poke/Buy.js")(msg, args, trainer);
            case "INFO":        return require("./poke/Info.js")(msg, trainer);
            case "COLLECTION":  return require("./poke/Collection.js")(msg, trainer);
            case "DETAILS":     return require("./poke/Details.js")(msg, args, trainer);
            case "SELL":        return require("./poke/Sell.js")(msg, args, trainer);
            case "HEAL":        return require("./poke/Heal.js")(msg, args, trainer);
            case "CHALLENGE":   return require("./poke/Challenge.js")(msg, args, trainer);
            case "TRADE":       return require("./poke/Trade.js")(msg, args, trainer);
            default:            return msg.channel.send("Disabled ATM! Updates are comming!");
        }
    }
};

function setUpUser(client, id) {
    client.pokemon.set(id, new Store({ path: `./json/pokemon/${id}.json`, indent: 2 }));
    const trainer = client.pokemon.get(id);
    for(i in def_setup) trainer.set(i, def_setup[i]);
}