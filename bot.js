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
const clientDiscord = new Discord.Client();

const onReadyDiscord = require("./js/discord/events/onReady.js");
const onMessageDiscord = require("./js/discord/events/onMessage.js");
const onVoiceStateUpdate = require("./js/discord/events/onVoiceStateUpdate.js");
const onGuildMemberAdd = require("./js/discord/events/onGuildMemberAdd.js");

clientDiscord.on("ready", onReadyDiscord);
clientDiscord.on("message", onMessageDiscord);
clientDiscord.on("voiceStateUpdate", (oldMember, newMember) => onVoiceStateUpdate(oldMember, newMember, clientDiscord));
clientDiscord.on("guildMemberAdd", onGuildMemberAdd);

clientDiscord.login(discord_token).then(setUp());

global.gClientDiscord = clientDiscord;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TWITCH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const clientTwitch = new tmi.client({
    identity: {
        username: twitch_username,
        password: twitch_token
    },
    channels: twitch_channels
});

const onMessageTwitch = require("./js/twitch/events/onMessage.js");
const onConnectedTwitch = require("./js/twitch/events/onConnected.js");
const onJoinTwitch = require("./js/twitch/events/onJoin.js");

clientTwitch.on("message", (channel, tags, message, self) => onMessageTwitch(clientTwitch, channel, tags, message, self, clientDiscord.twitch));
clientTwitch.on("connected", onConnectedTwitch);
clientTwitch.on("join", onJoinTwitch);
clientTwitch.connect();

global.gClientTwitch = clientTwitch;

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
        ["./js/discord/commands/normal", clientDiscord.commands = new Discord.Collection()],
        ["./js/discord/commands/admin", clientDiscord.admin = new Discord.Collection()],
        ["./js/twitch/commands/", clientDiscord.twitch = new Discord.Collection()]
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
            clientDiscord.commands.set(command.toUpperCase(), {
                name: command.toUpperCase(),
                description: { "info": "Custom command" },
                execute(client, msg, args) { 
                    return msg.channel.send(FormatCommand(msg, output)); 
                }
            });
        }
    }

    "[Server]: Finished Set Up".sendLog();
}