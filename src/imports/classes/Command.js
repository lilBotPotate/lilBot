const Universal = require("../functions/Universal");

/** 
 * Class representing a `Command`.
 */
class Command {
    /** 
     * Create a `Command` object.
    */
    constructor(name, info) {
        this.name = name;
        this.info = info;
        this.uses = [];
        this.subCommands = new Map();
        this.command; 
        this.execCounter = 0;
        this.type = "COMMAND";
        this.disabled = false;
    }
    
    /** 
     * Throw error if an element is not defined
     * in a setter
     * 
     * @throws an `Error`
     */
    throwSetError(element) { 
        throw new Error(`${element} is not defined!`); 
    }

    /** 
     * Set the name of the command.
     * 
     * @param {String} name
     * @returns {this}
     */
    setName(name) {
        if(!name) this.throwSetError("Name");
        this.name = name.toUpperCase();
        return this;
    }

    /** 
     * Set the info of the command.
     * 
     * @param {String} info
     * @returns {this}
     */
    setInfo(info) {
        if(!info) this.throwSetError("Info");
        this.info = info;
        return this;
    }

    /** 
     * Set the main executable command.
     * 
     * @param {Function} command
     * @returns {this}
     */
    setCommand(command) {
        if(!command) this.throwSetError("Command");
        this.command = command;
        return this;
    }

    /** 
     * Add a sub command.
     * 
     * @param {String} name
     * @param {Function} command
     * @returns {this}
     */
    addSubCommand(name, command) {
        if(!name) this.throwSetError("Sub command name");
        if(!command) this.throwSetError("Sub command");
        this.subCommands.set(name.toUpperCase(), command);
        return this;
    }
    
    /** 
     * Add usage.
     * 
     * @param {String} format How the command is used.
     * @param {String} description What happends when the command is used.
     * @returns {this}
     */
    addUse(format, description) {
        if(!format) this.throwSetError("Usage format");
        if(!description) this.throwSetError("Usage description");
        this.uses.push({ format, description });
        return this;
    }

    /** 
     * Disable this command.
     * 
     * @param {String} [reason]
     */
    disable(reason) {
        this.disabled = true;
        if(reason) this.reason = reason;
        return this;
    }
    
    /** 
     * Checks if the user has permission to use the command.
     * @returns {boolean} true
     */
    hasPermisson() {
        return true;
    }
    
    /** 
     * Executes either the main command or a sub command
     * based on the arguments.
     * 
     * @param {Discord.Message} msg `Discord.Message` object
     * @param {Array<String>} args
     * 
     * @returns {Promise<void>}
     */
    async execute(msg, args) {
        if(this.disabled) return msg.channel.send(`This command is disabled. ${this.reason ? `Reason: **${this.reason}**` : ""}`);
        if(!await this.hasPermisson(msg)) return;
        if(!msg) this.throwSetError("MSG in execute");
        Universal.sendLog(
            "command", 
            `DISCORD >>> ${msg.guild === null ? "DM " : this.type} >> ${msg.author.tag} > ${this.name} ${args}`
        );
        await msg.channel.startTyping();
        if(this.subCommands.size > 0 && args && args.length > 0) {
            const newArgs = [...args];
            const commandName = newArgs.shift().toUpperCase();
            if(this.subCommands.has(commandName)) {
                this.execCounter++;
                await this.subCommands.get(commandName)(msg, newArgs);
                return await msg.channel.stopTyping();
            }
        }
        if(!this.command) return await msg.channel.stopTyping();
        this.execCounter++;
        await this.command(msg, args);
        return await msg.channel.stopTyping();
    }
}

/** 
 * Sub class of `Command`. Represents `Normal` commands.
 */
class Normal extends Command {
    constructor() {
        super();
        this.type = "NORMAL";
    }
}

/** 
 * Sub class of `Command`. Represents `Admin` commands.
 */
class Admin extends Command {
    constructor() {
        super();
        this.type = "ADMIN";
    }

    hasPermisson(msg) {
        if(msg.member.hasPermission("ADMINISTRATOR")) return true;
        for(const role of global.gConfig.discord.admin_roles) {
            if(msg.member.roles.has(role)) return true;
        }
        return false;
    }
}

/** 
 * Sub class of `Command`. Represents `Master` commands.
 */
class Master extends Command {
    constructor() {
        super();
        this.type = "MASTER";
    }

    hasPermisson(msg) {
        if(msg.author.id == global.gConfig.discord.bot_owner_id) return true;
        return false;
    }
}

/** 
 * Sub class of `Command`. Represents `Twitch` commands.
 */
class Twitch extends Command {
    constructor() {
        super();
        this.type = "TWITCH";
    }

    /** 
     * Executes either the main command or a sub command
     * based on the arguments.
     * 
     * @param {tmi.client} client `tmi.client` object
     * @param {String} channel
     * @param {JSON} tags
     * @param {Array<String>} args
     * @param {*} self
     * 
     * @returns {Promise<void>}
     */
    async execute(client, channel, tags, args, self) {
        if(tags["message-type"] != "chat") return;
        if(this.disabled) return client.say(channel, "That command is disabled...");
        Universal.sendLog(
            "command", 
            `TWITCH >> ${tags.username} > ${this.name} ${args}`
        );

        if(this.subCommands.size > 0 && args && args.length > 0) {
            const newArgs = [...args];
            const commandName = newArgs.shift().toUpperCase();
            if(this.subCommands.has(commandName)) {
                this.execCounter++;
                return await this.subCommands.get(commandName)(client, channel, tags, args, self);
            }
        }
        if(!this.command) return;
        this.execCounter++;
        return await this.command(client, channel, tags, args, self);
    }
}

/** 
 * A module that exports @class Normal, @class Admin and @class Master
 * 
 * @module Command
*/
module.exports = { Normal, Admin, Master, Twitch }