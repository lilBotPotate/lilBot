const {
    Discord
} = require("../../../Imports.js");

const {
    jMods
} = require("../../../Stores.js");

module.exports = {
    name: "MODPOINTS",
    description: {
        "info": "Mods are getting points! Woop Woop!",
        "uses": {
            "modpoints": "list all mods with their points"
        }
    },
    execute(msg, args) {
        const modArr = jMods.get("mods");
        if(!modArr || modArr.length < 1) return msg.channel.send("No data has been stored yet!");
        const pointsArr = modArr.sort((a, b) => b.points - a.points)
                                .map((mod, i) => {
                                    const placeEmojis = {
                                        1: ":first_place:",
                                        2: ":second_place:",
                                        3: ":third_place:"
                                    }
                                    const emoji = placeEmojis[i + 1];
                                    return `**${emoji ? emoji : `${i + 1}.`} ${mod.name}:** ${mod.points} points`;
                                });
        
        const eMods = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("**MOD POINTS**")
            .setDescription(pointsArr.join("\n"));
    
        return msg.channel.send(eMods);
    }
};