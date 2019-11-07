const {
    Discord
} = require("../../../Imports.js");

const pokeArr = require("../../../../json/pokemon.json");

module.exports = {
    name: "POKEMON",
    description: {
        "info": "Gotta Catch 'Em All!",
        "uses": {
            "pokemon": "catch a pokemon"
        }
    },
    execute(client, msg, args) {
        const selectedPokemon = pokeArr[Math.floor(Math.random() * pokeArr.length)];

        const ePokemon = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle(`You caught:\n**${selectedPokemon.replace(".gif", "").toUpperCase()}**`)
            .setThumbnail(`https://play.pokemonshowdown.com/sprites/xyani/${selectedPokemon}`);

        return msg.channel.send(ePokemon);
    }
};