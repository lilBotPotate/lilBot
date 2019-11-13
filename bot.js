const {
    Discord,
    Async,
    tmi,
    fs,
    Store
} = require("./js/Imports.js");

const {
    SetDiscord,
    SetTwitch
} = require("./js/Clients.js");

const {
    jCommands
} = require("./js/Stores.js");

const {
    discord_token,
    twitch_token,
    twitch_username,
    twitch_channels
} = require("./config.json");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DISCORD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const clientD = new Discord.Client();

SetDiscord(clientD);

const onReadyDiscord = require("./js/discord/events/onReady.js");
const onMessageDiscord = require("./js/discord/events/onMessage.js");
const onVoiceStateUpdate = require("./js/discord/events/onVoiceStateUpdate.js");
const onGuildMemberAdd = require("./js/discord/events/onGuildMemberAdd.js");

clientD.on("ready", onReadyDiscord);
clientD.on("message", onMessageDiscord);
clientD.on("voiceStateUpdate", (oldMember, newMember) => onVoiceStateUpdate(oldMember, newMember, clientD));
clientD.on("guildMemberAdd", onGuildMemberAdd);

clientD.login(discord_token).then(setUp());

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TWITCH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const clientT = new tmi.client({
    identity: {
        username: twitch_username,
        password: twitch_token
    },
    channels: twitch_channels
});

SetTwitch(clientT);

const onMessageTwitch = require("./js/twitch/events/onMessage.js");
const onConnectedTwitch = require("./js/twitch/events/onConnected.js");
const onJoinTwitch = require("./js/twitch/events/onJoin.js");

clientT.on("message", (channel, tags, message, self) => onMessageTwitch(clientT, channel, tags, message, self, clientD.twitch));
clientT.on("connected", onConnectedTwitch);
clientT.on("join", onJoinTwitch);
clientT.connect();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ASYNC ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const updates = require("./js/Updates.js");

Async.forever(
    function(next) {
        setTimeout(function() {
            try { updates(clientD); } 
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
        ["./js/discord/commands/dm", clientD.dm = new Discord.Collection()],
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
                execute(client, msg, args) { 
                    return msg.channel.send(FormatCommand(msg, output)); 
                }
            });
        }
    }

    "[Server]: Finished Set Up".sendLog();
}