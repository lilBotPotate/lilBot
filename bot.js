const {
    Discord,
    Async,
    tmi,
    fs
} = require("./js/Imports.js");

const {
    jCommands
} = require("./js/Stores.js");

global.gConfig = require("./config.json");

const {
    discord_token,
    twitch_token,
    twitch_username,
    twitch_channels
} = global.gConfig;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DISCORD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const clientD = new Discord.Client();
global.gClientDiscord = clientD;

const onMessageDiscord = require("./js/discord/events/onMessage.js");
const onGuildMemberAdd = require("./js/discord/events/onGuildMemberAdd.js");

clientD.on("message", onMessageDiscord);
clientD.on("guildMemberAdd", onGuildMemberAdd);

// clientD.on("debug", (info) =>            `[Server][D]: ${info}`.sendLog());
clientD.on("disconnect", (event) =>      `[Server][D]: Disconnected: ${event}`.sendLog());
clientD.on("error", (error) =>           `[Server][D]: Error: ${error}`.sendLog());
clientD.on("ready", () =>                `[Server][D]: Logged in as ${clientD.user.tag} (${clientD.users.size} users, ${clientD.channels.size} channels, ${clientD.guilds.size} guilds)`.sendLog());
clientD.on("reconnecting", (replayed) => `[Server][D]: Reconnecting: ${replayed} replays`.sendLog());
clientD.on("resume", (replayed) =>       `[Server][D]: Resuming: ${replayed} replays`.sendLog());
clientD.on("warn", (info) =>             `[Server][D]: Warning: ${info}`.sendLog());

clientD.login(discord_token).then(() => {
    clientD.user.setActivity("mention me for help :)", { type: "WATCHING" });
    setUp();
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TWITCH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const clientTwitch = new tmi.client({
    identity: {
        username: twitch_username,
        password: twitch_token
    },
    channels: twitch_channels
});

global.gClientTwitch = clientTwitch;

const onMessageTwitch = require("./js/twitch/events/onMessage.js");

clientTwitch.on("message", (channel, tags, message, self) => onMessageTwitch(clientTwitch, channel, tags, message, self, clientD.twitch));

clientTwitch.on("connected", (addr, port) =>     `[Server][T]: Connected to ${addr}:${port}`.sendLog());
clientTwitch.on("connecting", (addr, port) =>    `[Server][T]: Connecting to ${addr}:${port}`.sendLog());
clientTwitch.on("disconnected", (reason) =>      `[Server][T]: Disconnected: ${reason}`.sendLog());
clientTwitch.on("logon", () =>                   `[Server][T]: Connection established, sending informations to server`.sendLog());
clientTwitch.on("reconnect", () =>               `[Server][T]: Reconnecting`.sendLog());
clientTwitch.on("roomstate", (channel, state) => `[Server][T]: Joined channel ${channel} ID ${state["room-id"]}`.sendLog());

clientTwitch.connect();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ASYNC ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const updates = require("./js/Updates.js");

Async.forever(
    function(next) {
        setTimeout(function() {
            try { updates(); } 
            catch (error) { console.log(error) }
            next();
        }, (Math.floor(Math.random() * 60) + 15) * 1000);
    },
    function(err) { return console.log(err); }
);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function setUp() {
    /* COMMANDS */
    const setUpArr = [
        ["./js/discord/commands/normal", clientD.commands = new Discord.Collection()],
        ["./js/discord/commands/admin", clientD.admin = new Discord.Collection()],
        ["./js/discord/commands/master", clientD.master = new Discord.Collection()],
        ["./js/twitch/commands/", clientD.twitch = new Discord.Collection()]
    ]

    for (set of setUpArr) {
        const commandFiles = fs.readdirSync(`${set[0]}`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${set[0]}/${file}`);
            set[1].set(command.name, command);
        }
    }

    /* CUSTOM COMMANDS */
    const FormatCommand = require("./js/FormatCommand.js");
    const customCommands = jCommands.get("commands");
    if(customCommands) {
        for(command in customCommands) {
            let output = customCommands[command];
            clientD.commands.set(command.toUpperCase(), {
                name: command.toUpperCase(),
                description: { "info": "Custom command" },
                execute(msg, args) { 
                    return msg.channel.send(FormatCommand(msg, output)); 
                }
            });
        }
    }

    "[Server][I]: Finished Set Up".sendLog();
}