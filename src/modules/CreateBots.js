const {
    Discord,
    fs,
    tmi,
    Universal
} = require("./Imports");

const { jCommands } = require("./Stores");

/**
 * Creates and initiates Discord and Twitch bot
 * @module createBots
 * @async
 * @returns {Boolean} `true` if both bots were created
 */
module.exports = async function() {
    try { 
        await createDiscordBot();
        Universal.sendLog("info", "Finished creating Discord bot"); 
    } catch (error) {
        Universal.sendLog("error", `Couldn't create Discord bot\n${error}`); 
        return false;
    }

    try { 
        await createTwitchBot(); 
        Universal.sendLog("info", "Finished creating Twitch bot"); 
    } catch (error) {
        Universal.sendLog("error", `Couldn't create Twitch bot\n${error}`); 
        return false;
    }
    return true;
};

/**
 * Creates and initiates Discord bot
 * 
 * @async
 * @returns {Promise<Object>} Discord client
 */
async function createDiscordBot() {
    const clientDiscord = new Discord.Client();

    /** 
     * Binds **Discord.Client** to 
     * **NodeJs.Global** object @var gClientDiscord
     * 
     * @type {Object}
     */
    global.gClientDiscord = clientDiscord;

    const onMessage = require("../bots/discord/events/onMessage");
    const onGuildMemberAdd = require("../bots/discord/events/onGuildMemberAdd");
    const onReady = require("../bots/discord/events/onReady");

    clientDiscord.on("message", onMessage);
    clientDiscord.on("guildMemberAdd", onGuildMemberAdd);
    clientDiscord.on("ready", onReady);

    clientDiscord.on("disconnect", (event) => Universal.sendLog("warn", `Discord client disconnected: ${event}`));
    clientDiscord.on("error", (error) => Universal.sendLog("error", `Discord client error: ${error}`));
    clientDiscord.on("reconnecting", (replayed) => Universal.sendLog("warn", `Reconnecting: ${replayed} replays`));
    clientDiscord.on("resume", (replayed) => Universal.sendLog("info", `Resuming: ${replayed} replays`));
    clientDiscord.on("warn", (info) => Universal.sendLog("warn", ` Warning: ${info}`));
    
    await createDiscordCommands();
    
    await clientDiscord.login(process.env.DISCORD_TOKEN);
    await clientDiscord.user.setActivity("If I crash DM my Master :(", { type: "WATCHING" });

    return clientDiscord;

    /**
     * Adds the command modules from `./js/discord/commands/*` to **Discord.Collection**
     * and inserts it into **Discord.Client**
     * 
     * @async
     * @returns {*}
     */
    async function createDiscordCommands() {
        const commandCollections = [
            ["normal", clientDiscord.commands = new Discord.Collection()],
            ["admin", clientDiscord.admin = new Discord.Collection()],
            ["master", clientDiscord.master = new Discord.Collection()]
        ]
    
        for(set of commandCollections) {
            const commandFiles = fs.readdirSync(`./src/bots/discord/commands/${set[0]}`).filter(file => file.endsWith(".js"));
            for(const file of commandFiles) {
                const command = require(`../bots/discord/commands/${set[0]}/${file}`);
                await set[1].set(command.name, command);
            }
        }
        
        /**
         * @description Reads stored custom functions to the **Discord.Client** and
         * adds functionality to them based on the inserted parameters
         */
        const FormatCommand = require("./FormatCommand");
        const customCommands = await jCommands.get("commands");
        if(customCommands) {
            for(command in customCommands) {
                let output = await customCommands[command];
                await clientDiscord.commands.set(command.toUpperCase(), {
                    name: await command.toUpperCase(),
                    description: { "info": "Custom command" },
                    execute(msg, args) { 
                        return msg.channel.send(FormatCommand(msg, output)); 
                    }
                });
            }
        }
        return Universal.sendLog("info", "Finished Discord commands setup");
    }
}

/**
 * Creates and initiates Twitch bot
 * 
 * @async
 * @returns {Promise<Object>} Twitch client
 */
async function createTwitchBot() {
    const clientTwitch = await new tmi.client({
        identity: {
            username: global.gConfig.twitch.username,
            password: process.env.TWITCH_TOKEN
        },
        channels: global.gConfig.twitch.channels,
        connection: {
            reconnect: true
        }
    });
    
    /** 
     * Binds **Discord.Client** to 
     * **NodeJs.Global** object @var gClientTwitch
     * 
     * @type {Object}
     */
    global.gClientTwitch = clientTwitch;
    
    const onMessage = require("../bots/twitch/events/onMessage");
    const onDisconnect = require("../bots/twitch/events/onDisconnect");
    
    await clientTwitch.on("message", onMessage);
    await clientTwitch.on("disconnected", onDisconnect);
    
    await clientTwitch.on("connected", (addr, port) => Universal.sendLog("info", `Twitch client connected to ${addr}:${port}`));
    await clientTwitch.on("connecting", (addr, port) => Universal.sendLog("info", `Twitch client connecting to ${addr}:${port}`));
    await clientTwitch.on("logon", () => Universal.sendLog("info", `Twitch clients connection established, sending informations to server`));
    await clientTwitch.on("reconnect", () => Universal.sendLog("warn", `Twitch client reconnecting`));
    await clientTwitch.on("roomstate", (channel, state) => Universal.sendLog("info", `Twitch client joined channel ${channel} ID ${state["room-id"]}`));

    await createTwitchCommands();
    
    await clientTwitch.connect();

    return clientTwitch;

    /**
     * Adds the command modules from `./js/twitch/commands/*` to **Map**
     * and inserts it into **tmi.client**
     * 
     * @async
     * @returns {*}
     */
    async function createTwitchCommands() {
        clientTwitch.commands = new Map();
        const commandFiles = fs.readdirSync("./src/bots/twitch/commands").filter(file => file.endsWith(".js"));
        for(const file of commandFiles) {
            const command = require(`../bots/twitch/commands/${file}`);
            await clientTwitch.commands.set(command.name, command);
        }
        return Universal.sendLog("info", "Finished Twitch commands setup");
    }
}