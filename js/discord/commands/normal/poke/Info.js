const {
    Discord
} = require("../../../../Imports.js");

module.exports = function(msg, trainer) {
    const pokeAmount = Object.keys(trainer.get("pokemons")).length;
    const coins = trainer.get("coins");
    const pokeballs = trainer.get("pokeballs");
    const potions = trainer.get("potions");
    
    const eInfo = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**TRAINER ${msg.author.username.toUpperCase()}**`)
        .setDescription(
            `**KINDS:** ${pokeAmount}\n` +
            `**POKEBALLS:** ${pokeballs}\n` + 
            `**COINS:** ${coins}\n` +
            `**POTIONS:** ${potions}` 
        )
        .setThumbnail(msg.author.avatarURL);
    
    msg.channel.send(eInfo);
};