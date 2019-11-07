const {
    Discord
} = require("../../Imports.js");

const { prefix, prefixA, admin_roles } = require("../../../config.json");

module.exports = function(msg) {
    const client = this;
    if(msg.author.bot) return;
    if(msg.guild === null) return dmCommands(client, msg);
    else if(msg.content.startsWith(prefix)) return normalCommands(client, msg);
    else if(msg.content.startsWith(prefixA)) return adminCommands(client, msg);
    else if(msg.isMemberMentioned(client.user)) return botMention(msg, false);
};

function dmCommands(client, msg) {
    if(msg.isMemberMentioned(client.user)) return botMention(msg, true);
    if(!msg.content.startsWith(prefix)) return msg.author.send("Hello im **lilBot**! Join the lilClub :stuck_out_tongue_winking_eye:");

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toUpperCase();

    if(!client.dm.has(command)) return `That command does't exist... **${prefix}help**`.sendTemporary(msg);
    try {
        `[Discord][DM]: ${msg.author.tag} executed ${command} ${args}`.sendLog();
        return client.dm.get(command).execute(client, msg, args);
    } catch (error) { `[Error]: ${error}`.sendLog(); }
}

function normalCommands(client, msg) {
    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toUpperCase();

    if(!client.commands.has(command)) return `That command does't exist... **${prefix}help**`.sendTemporary(msg);
    try {
        `[Discord][N]: ${msg.author.tag} executed ${command} ${args}`.sendLog();
        return client.commands.get(command).execute(client, msg, args);
    } catch (error) { `[Error]: ${error}`.sendLog();  }
    return;
}

function adminCommands(client, msg) {
    const args = msg.content.slice(prefixA.length).split(/ +/);
    const command = args.shift().toUpperCase();

    let isAdmin = false;
    if(msg.member.hasPermission("ADMINISTRATOR")) isAdmin = true;
    if(!isAdmin) for(i of admin_roles) if(msg.member.roles.has(i)) isAdmin = true;
    
    if(!isAdmin) return "You dont have ADMIN/MOD permissions".sendTemporary(msg);
    if(!client.admin.has(command)) return `That command does't exist... **${prefixA}help**`.sendTemporary(msg);
    try {
        `[Discord][A]: ${msg.author.tag} executed ${command} ${args}`.sendLog();
        return client.admin.get(command).execute(client, msg, args);
    } catch (error) { console.log(error) }
    return;
}

function botMention(msg, dm) {
    `[Discord]${dm ? "[DM]" : ""}: ${msg.author.tag} mentioned the bot`.sendLog();
    const helpChannel = `**${prefix}help:** Normal commands`
                      + `\n**${prefixA}help:** Admin commands`

    const helpDM = `**${prefix}help:** DM commands`

    const eMention = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("**HELP COMMANDS**")
        .setDescription(dm ? helpDM : helpChannel);

    if(dm) return msg.author.send(eMention);
    else return msg.channel.send(eMention);
}