import {
    Discord,
    fs,
    tmi
} from "./Imports";

import { jCommands } from "./Stores";

/**
 * Creates and initiates Discord and Twitch bot
 * @module createBots
 * @async
 * @returns {Promise<Boolean>} `true` if both bots were created
 */
export default async function createBots(a) {
    try { 
        await createDiscordBot(); 
        "[Server][D]: Finished creating the bot".sendLog();
    } catch (error) {
        `[Error][D]: Couldn't create Discord bot\n${error}`.sendLog();
        return false;
    }

    try { 
        await createTwitchBot(); 
        "[Server][T]: Finished creating the bot".sendLog();
    } catch (error) {
        `[Error][T]: Coundn't create Twitch bot\n${error}`.sendLog();
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
    global.gClientDiscord = clientDiscord;

    const onMessageDiscord = require("../bots/discord/events/onMessage.js.js");
    const onGuildMemberAdd = require("../bots/discord/events/onGuildMemberAdd.js.js");

    clientDiscord.on("message", onMessageDiscord);
    clientDiscord.on("guildMemberAdd", onGuildMemberAdd);

    clientDiscord.on("disconnect", (event) =>      `[Server][D]: Disconnected: ${event}`.sendLog());
    clientDiscord.on("error", (error) =>           `[Server][D]: Error: ${error}`.sendLog());
    clientDiscord.on("ready", () =>                `[Server][D]: Logged in as ${clientDiscord.user.tag} (${clientDiscord.users.size} users, ${clientDiscord.channels.size} channels, ${clientDiscord.guilds.size} guilds)`.sendLog());
    clientDiscord.on("reconnecting", (replayed) => `[Server][D]: Reconnecting: ${replayed} replays`.sendLog());
    clientDiscord.on("resume", (replayed) =>       `[Server][D]: Resuming: ${replayed} replays`.sendLog());
    clientDiscord.on("warn", (info) =>             `[Server][D]: Warning: ${info}`.sendLog());
    
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
            ["bots/discord/commands/normal", clientDiscord.commands = new Discord.Collection()],
            ["bots/discord/commands/admin", clientDiscord.admin = new Discord.Collection()],
            ["bots/discord/commands/master", clientDiscord.master = new Discord.Collection()]
        ]
    
        for(set of commandCollections) {
            const commandFiles = fs.readdirSync(`./js/${set[0]}`).filter(file => file.endsWith(".js"));
            for(const file of commandFiles) {
                const command = require(`./${set[0]}/${file}`);
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
        return await "[Server][D]: Finished Discord Commands Set Up".sendLog();
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
            username: process.env.TWITCH_USERNAME,
            password: process.env.TWITCH_TOKEN
        },
        channels: [ process.env.TWITCH_CHANNEL ],
        connection: {
            reconnect: true
        }
    });
    
    global.gClientTwitch = clientTwitch;
    
    const onMessageTwitch = require("../bots/twitch/events/onMessage.js.js");
    const onDisconnect = require("../bots/twitch/events/onDisconnect.js.js");
    
    await clientTwitch.on("message", onMessageTwitch);
    await clientTwitch.on("disconnected", onDisconnect);
    
    await clientTwitch.on("connected", (addr, port) =>     `[Server][T]: Connected to ${addr}:${port}`.sendLog());
    await clientTwitch.on("connecting", (addr, port) =>    `[Server][T]: Connecting to ${addr}:${port}`.sendLog());
    await clientTwitch.on("logon", () =>                   `[Server][T]: Connection established, sending informations to server`.sendLog());
    await clientTwitch.on("reconnect", () =>               `[Server][T]: Reconnecting`.sendLog());
    await clientTwitch.on("roomstate", (channel, state) => `[Server][T]: Joined channel ${channel} ID ${state["room-id"]}`.sendLog());

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
        const twitchCommandsPath = "bots/twitch/commands/";
        const commandFiles = fs.readdirSync(`./js/${twitchCommandsPath}`).filter(file => file.endsWith(".js"));
        for(const file of commandFiles) {
            const command = require(`./${twitchCommandsPath}/${file}`);
            await clientTwitch.commands.set(command.name, command);
        }
        return await "[Server][T]: Finished Twitch Commands Set Up".sendLog();
    }
}