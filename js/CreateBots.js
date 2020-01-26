const {
    Discord,
    fs,
    tmi
} = require("./Imports");

const {
    jCommands
} = require("./Stores");

module.exports = async function() {
    try { 
        await createDiscordBot(); 
        "[Server][D]: Finished creating the bot".sendLog();
    } catch (error) {
        `[Error][D]: ${error}`.sendLog();
        return false;
    }

    try { 
        await createTwitchBot(); 
        "[Server][T]: Finished creating the bot".sendLog();
    } catch (error) {
        `[Error][T]: ${error}`.sendLog();
        return false;
    }
    return true;
};

async function createDiscordBot() {
    const clientDiscord = new Discord.Client();
    global.gClientDiscord = clientDiscord;

    const onMessageDiscord = require("./discord/events/onMessage.js");
    const onGuildMemberAdd = require("./discord/events/onGuildMemberAdd.js");

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
    await clientDiscord.user.setActivity("mention me for help :)", { type: "WATCHING" });

    return clientDiscord;

    async function createDiscordCommands() {
        const commandCollections = [
            ["discord/commands/normal", clientDiscord.commands = new Discord.Collection()],
            ["discord/commands/admin", clientDiscord.admin = new Discord.Collection()],
            ["discord/commands/master", clientDiscord.master = new Discord.Collection()]
        ]
    
        for(set of commandCollections) {
            const commandFiles = fs.readdirSync(`./js/${set[0]}`).filter(file => file.endsWith(".js"));
            for(const file of commandFiles) {
                const command = require(`./${set[0]}/${file}`);
                await set[1].set(command.name, command);
            }
        }
    
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
    
    const onMessageTwitch = require("./twitch/events/onMessage.js");
    const onDisconnect = require("./twitch/events/onDisconnect.js");
    
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

    async function createTwitchCommands() {
        clientTwitch.commands = new Map();
        const twitchCommandsPath = "twitch/commands/";
        const commandFiles = fs.readdirSync(`./js/${twitchCommandsPath}`).filter(file => file.endsWith(".js"));
        for(const file of commandFiles) {
            const command = require(`./${twitchCommandsPath}/${file}`);
            await clientTwitch.commands.set(command.name, command);
        }
        return await "[Server][T]: Finished Twitch Commands Set Up".sendLog();
    }
}