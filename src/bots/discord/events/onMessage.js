const {
    Discord,
    Universal
} = require("../../../modules/Imports");

const {
    jEnemys
} = require("../../../modules/Stores");

module.exports = function(msg) {
    if(msg.author.bot) return;
    else if(msg.channel.id === global.gConfig.discord.twitch_discord_chat) return sendToTwitch(msg);
    else if(msg.content.startsWith(global.gConfig.prefixes.normal)) return normalCommands(this, msg);
    else if(msg.content.startsWith(global.gConfig.prefixes.admin)) return adminCommands(this, msg);
    else if(msg.content.startsWith(global.gConfig.prefixes.master)) return masterCommands(this, msg);
    else if(!msg.mentions.everyone && msg.isMemberMentioned(this.user)) return botMention(msg);
};

function normalCommands(client, msg) {
    const args = msg.content.slice(global.gConfig.prefixes.normal.length).split(/ +/);
    const command = args.shift().toUpperCase();
    if(!client.commands.has(command)) return;
    if(!canUseBot(msg)) return msg.author.send("You are not allowed to use this bot!");
    msg.channel.startTyping();
    try {
        Universal.sendLog(
            "info", 
            `DISCORD >>> ${msg.guild === null ? "DM " : "NORMAL"} >> ${msg.author.tag} > ${command} ${args}`
        );
        client.commands.get(command).execute(msg, args);
    } catch (error) { Universal.sendLog("error", `Failed executing normal Discord command\n${error}`); }
    return msg.channel.stopTyping();
}

function adminCommands(client, msg) {
    const args = msg.content.slice(global.gConfig.prefixes.admin.length).split(/ +/);
    const command = args.shift().toUpperCase();
    if(!client.admin.has(command)) return;
    if(!canUseBot(msg)) return msg.channel.send("You are not allowed to use this bot!");
    let isAdmin = false;
    if(msg.member.hasPermission("ADMINISTRATOR")) isAdmin = true;
    if(!isAdmin) for(i of global.gConfig.discord.admin_roles) if(msg.member.roles.has(i)) isAdmin = true;
    if(!isAdmin) return Universal.sendTemporary(msg, "You dont have **ADMIN/MOD** permissions");
    msg.channel.startTyping();
    try {
        Universal.sendLog(
            "info", 
            `DISCORD >>> ADMIN >> ${msg.author.tag} > ${command} ${args}`
        );
        client.admin.get(command).execute(msg, args);
    } catch (error) { Universal.sendLog("error", `Failed executing admin Discord command\n${error}`); }
    return msg.channel.stopTyping();;
}

function masterCommands(client, msg) {
    const args = msg.content.slice(global.gConfig.prefixes.master.length).split(/ +/);
    const command = args.shift().toUpperCase();
    const isMaster = msg.author.id == global.gConfig.discord.bot_owner_id;
    if(!isMaster || !client.master.has(command)) return;
    msg.channel.startTyping();
    try {
        Universal.sendLog(
            "info", 
            `DISCORD >>> MASTER >> ${msg.author.tag} > ${command} ${args}`
        );
        client.master.get(command).execute(msg, args);
    } catch (error) {  Universal.sendLog("error", `Failed executing master Discord command\n${error}`); }
    return msg.channel.stopTyping();
}

function botMention(msg, dm) {
    msg.channel.startTyping();
    Universal.sendLog(
        "info", 
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
        "info", 
        `DISCORD >>> ${msg.author.tag} send a message to twitch >> ${msg.content.length} characters > ${msg.content}`
    );

    try {
        for(const channel of global.gConfig.twitch.channels) {
            global.gClientTwitch.say(channel, `[${msg.author.username}]: ${msg.content}`);
        }
    } catch (error) { Universal.sendLog("error", `Failed sending a message to twitch channel\n${error}`); }
}

/* --------------- METHODS --------------- */
function canUseBot(msg) {
    const enemies = jEnemys.get("enemies");
    if(!enemies || enemies.length < 1) return true; 
    return !enemies.includes(msg.author.id);
}