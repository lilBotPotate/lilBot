const {
    Discord
} = require("../../Imports.js");

const { prefix, prefixA, admin_roles } = require("../../../config.json");

module.exports = function(msg) {
    const client = this;
    if(msg.author.bot) return;
    else if(msg.content.startsWith(prefix)) return normalCommands(client, msg);
    else if(msg.content.startsWith(prefixA)) return adminCommands(client, msg);
    else if(msg.isMemberMentioned(client.user)) return botMention(msg);
};

function normalCommands(client, msg) {
    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toUpperCase();

    if(!client.commands.has(command)) return;
    try {
        `[Discord]${msg.guild === null ? "[DM]" : "[N]"}: ${msg.author.tag} executed ${command} ${args}`.sendLog();
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
    if(!client.admin.has(command)) return;
    try {
        `[Discord][A]: ${msg.author.tag} executed ${command} ${args}`.sendLog();
        return client.admin.get(command).execute(client, msg, args);
    } catch (error) { console.log(error) }
    return;
}

function botMention(msg, dm) {
    `[Discord]${msg.guild === null ? "[DM]" : ""}: ${msg.author.tag} mentioned the bot`.sendLog();
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