const {
    Discord
} = require("../../../../Imports.js");

module.exports = async function(msg, trainer) {
    const pokemons = await trainer.get("pokemons");

    let pokeNames = [];
    for(p in pokemons) {
        const pokemon = pokemons[p];
        pokeNames.push(`**${pokemon.name.toUpperCase()}** [${pokemon.normal}|${pokemon.shiny}]`);
    }

    const ePokemons = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**TRAINER ${msg.author.username.toUpperCase()}**`)
        .setDescription(`**${Object.keys(pokemons).length}** kinds of Pokemons`)
        .addField("**POKEMONS**", pokeNames.sort().join(" - "));

    await msg.channel.send(ePokemons);
};