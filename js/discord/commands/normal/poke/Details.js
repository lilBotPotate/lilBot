const {
    Discord
} = require("../../../../Imports.js");

module.exports = function(msg, args, trainer) {
    if(!args[0]) return msg.channel.send("You need to insert the name or id!");

    const pokeName = args.shift().toLowerCase();

    const pokemons = trainer.get("pokemons");
    
    let jPokemon, pokeID;
    if(!isNaN(pokeName)) { jPokemon = pokemons[pokeName]; pokeID = pokeName; }
    else {
        for(p in pokemons) {
            const poke = pokemons[p];
            if(poke.name == pokeName) { jPokemon = poke; pokeID = p; break; }
        }
    }
    
    if(!jPokemon) return msg.channel.send("You don't have that pokemon!");

    const ePokemon = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**${jPokemon.name.toUpperCase()}**`)
        .setDescription(
            `**ID:** ${pokeID}\n` +
            `**TYPES:** ${jPokemon.types.join(", ")}\n` + 
            `**ATTACK:** ${jPokemon.attack}\n` +
            `**HP:** ${jPokemon.base_hp}\n` +
            `**WEIGHT:** ${jPokemon.weight}\n` +
            `**HEIGHT:** ${jPokemon.height}\n` +
            `**NORMAL:** ${jPokemon.normal}\n` +
            `**SHINY:** ${jPokemon.shiny}`
        )
        .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeID}.png`);
    
    msg.channel.send(ePokemon);
};