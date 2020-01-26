const {
    Discord
} = require("../../Imports.js");

const {
    jEnemys
} = require("../../Stores.js");

module.exports = function(msg) {
    const client = global.gClientDiscord;
    if(msg.author.bot) return;
    else if(msg.channel.id === process.env.TWITCH_DISCORD_CHAT) return sendToTwitch(msg);
    else if(msg.content.startsWith(process.env.PREFIX)) return normalCommands(client, msg);
    else if(msg.content.startsWith(process.env.PREFIX_ADMIN)) return adminCommands(client, msg);
    else if(msg.content.startsWith(process.env.PREFIX_MASTER)) return masterCommands(client, msg);
    else if(!msg.mentions.everyone && msg.isMemberMentioned(client.user)) return botMention(msg);
};

function normalCommands(client, msg) {
    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/);
    const command = args.shift().toUpperCase();

    if(!client.commands.has(command)) return;
    if(!canUseBot(msg)) return msg.author.send("You are not allowed to use this bot!");
    try {
        `[D]${msg.guild === null ? "[DM]" : ""}: ${msg.author.tag} executed ${process.env.PREFIX}${command} ${args}`.sendLog();
        return client.commands.get(command).execute(msg, args);
    } catch (error) { `[Error]: ${error}`.sendLog();  }
    return;
}

function adminCommands(client, msg) {
    const args = msg.content.slice(process.env.PREFIX_ADMIN.length).split(/ +/);
    const command = args.shift().toUpperCase();

    if(!client.admin.has(command)) return;
    if(!canUseBot(msg)) return msg.channel.send("You are not allowed to use this bot!");
    let isAdmin = false;
    if(msg.member.hasPermission("ADMINISTRATOR")) isAdmin = true;
    if(!isAdmin) for(i of global.gConfig.admin_roles) if(msg.member.roles.has(i)) isAdmin = true;
    if(!isAdmin) return "You dont have **ADMIN/MOD** permissions".sendTemporary(msg);
    try {
        `[D]: ${msg.author.tag} executed ${process.env.PREFIX_ADMIN}${command} ${args}`.sendLog();
        return client.admin.get(command).execute(msg, args);
    } catch (error) { console.log(error) }
    return;
}


function masterCommands(client, msg) {
    const args = msg.content.slice(process.env.PREFIX_MASTER.length).split(/ +/);
    const command = args.shift().toUpperCase();

    const isMaster = msg.author.id == process.env.BOT_MASTER_DISCORD_ID;
    if(!isMaster) return "You are not my master!".sendTemporary(msg);
    if(!client.master.has(command)) return;
    try {
        `[D]: ${msg.author.tag} executed ${process.env.PREFIX_MASTER}${command} ${args}`.sendLog();
        return client.master.get(command).execute(msg, args);
    } catch (error) { console.log(error) }
    return;
}

function botMention(msg, dm) {
    `[D]${msg.guild === null ? "[DM]" : ""}: ${msg.author.tag} mentioned the bot`.sendLog();
    const helpChannel = `**${process.env.PREFIX}help:** Normal commands`
                      + `\n**${process.env.PREFIX_ADMIN}help:** Admin commands`

    const helpDM = `**${process.env.PREFIX}help:** DM commands`

    const eMention = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("**HELP COMMANDS**")
        .setDescription(dm ? helpDM : helpChannel);

    if(dm) return msg.author.send(eMention);
    else return msg.channel.send(eMention);
}

function sendToTwitch(msg) {
    `[D]: ${msg.author.tag} send to twitch ${msg.content}`.sendLog();
    global.gClientTwitch.say(process.env.TWITCH_CHANNEL, `[${msg.author.username}]: ${msg.content}`);
}

/* --------------- METHODS --------------- */
function canUseBot(msg) {
    const enemies = jEnemys.get("enemies");
    if(!enemies || enemies.length < 1) return true; 
    return !enemies.includes(msg.author.id);
}