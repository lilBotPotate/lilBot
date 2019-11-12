const {
    Discord,
    request
} = require("../../../../Imports.js");
// 807
module.exports = async function(msg, trainer) {
    const pokeballs = await trainer.get("pokeballs");
    if(pokeballs < 1) return msg.channel.send("You are out of pokeballs!");
    await trainer.set("pokeballs", pokeballs - 1);

    let id = Math.floor(Math.random() * 807) + 1;
    const isShiny = (Math.floor(Math.random() * 100) + 1) >= 50 ? true : false;
    let name;

    if(await trainer.has(`pokemons.${id}`)) {
        if(isShiny) {
            const shiny = await trainer.get(`pokemons.${id}.shiny`);
            await trainer.set(`pokemons.${id}.shiny`, shiny + 1);
        } else {
            const normal = await trainer.get(`pokemons.${id}.normal`);
            await trainer.set(`pokemons.${id}.normal`, normal + 1);
        }
        name = await trainer.get(`pokemons.${id}.name`);
    } else {
        const JPoke = await getJSON(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if(!JPoke) return {};
    
        const types = await JPoke.types.map(p => p.type.name).reverse();
        let attack, hp;
        for(s of JPoke.stats) {
            if(s.stat.name == "attack") attack = s.base_stat;
            if(s.stat.name == "hp") hp = s.base_stat;
        }

        name = JPoke.name;

        const pokemonData = {
            "name": name,
            "types": types,
            "attack": attack,
            "base_hp": hp,
            "hp": hp,
            "weight": JPoke.weight,
            "height": JPoke.height,
            "normal": isShiny ? 0 : 1,
            "shiny": isShiny ? 1 : 0,
        }
        trainer.set(`pokemons.${id}`, pokemonData);
    }

    return sendPokemon(msg, id, name, isShiny);
};

function sendPokemon(msg, id, name, isShiny) {
    const baseURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
    const ePoke = new Discord.RichEmbed()
        .setColor(isShiny ? "#00cc00" : "#0000cc")
        .setTitle(`You caught:\n${isShiny ? ":star: " : ""}**${name.toUpperCase()}**!`)
        .setThumbnail(`${baseURL}${isShiny ? "shiny/" : ""}${id}.png`)
        .setFooter("Powered by pokeapi.co", "https://pokeapi.co/static/logo-6221638601ef7fa7c835eae08ef67a16.png");

    msg.channel.send(ePoke);
}

function getJSON(url) {
    return new Promise(function (resolve, reject) {
        request(url, { json: true }, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}