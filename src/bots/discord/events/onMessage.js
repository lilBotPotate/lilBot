const {
    Discord,
    Universal
} = require("../../../imports/Imports");

const {
    jEnemys
} = require("../../../imports/functions/Stores");

module.exports = function(msg) {
    if(msg.author.bot) return;
    if(msg.channel.id === global.gConfig.discord.twitch_discord_chat) return sendToTwitch(msg);
    if(canUseBot(msg)) return executeCommand(this, msg);
    if(!msg.mentions.everyone && msg.isMemberMentioned(this.user)) return botMention(msg);
};

function executeCommand(client, msg) {
    const args = msg.content.slice(global.gConfig.prefixes.normal.length).split(/ +/);
    const command = args.shift().toUpperCase();

    let commandCollection;
    if(msg.content.startsWith(global.gConfig.prefixes.normal)) commandCollection = client.commands;
    else if(msg.content.startsWith(global.gConfig.prefixes.admin)) commandCollection = client.admin;
    else if(msg.content.startsWith(global.gConfig.prefixes.master)) commandCollection = client.master;

    
    if(!commandCollection) return Universal.sendLog("error", "Command collection doesn't exist!");
    if(!commandCollection.has(command)) return;
    return commandCollection.get(command).execute(msg, args);
}

function botMention(msg, dm) {
    msg.channel.startTyping();
    Universal.sendLog(
        "command", 
        `DISCORD >> ${msg.guild === null ? "DM" : "SERVER"} > ${msg.author.tag} mentioned the bot`
    );
    const helpChannel = `**${global.gConfig.prefixes.normal}help:** Normal commands\n`
                      + `**${global.gConfig.prefixes.admin}help:** Admin commands`;

    const helpDM = `**${global.gConfig.prefixes.normal}help:** DM commands`
    const eMention = new Discord.RichEmbed()
                   .setColor("RANDOM")
                   .setTitle("**HELP COMMANDS**")
                   .setDescription(dm ? helpDM : helpChannel);

    if(dm) msg.author.send(eMention);
    else msg.channel.send(eMention);

    return msg.channel.stopTyping();
}

function sendToTwitch(msg) {
    Universal.sendLog(
        "command", 
        `DISCORD >>> ${msg.author.tag} send a message to twitch >> ${msg.content.length} characters > ${msg.content}`
    );

    try {
        for(const channel of global.gConfig.twitch.channels) {
            global.gClientTwitch.say(channel, `[${msg.author.username}]: ${msg.content}`);
        }
    } catch (error) { Universal.sendLog("error", `Failed sending a message to twitch channel\n${error}`); }
}

/* --------------------------------------------- METHODS --------------------------------------------- */
function canUseBot(msg) {
    const enemies = jEnemys.get("enemies");
    if(!enemies || enemies.length < 1) return true; 
    return !enemies.includes(msg.author.id);
}