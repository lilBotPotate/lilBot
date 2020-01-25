const {
    Discord,
    fs
} = require("../../Imports");

const {
    jCommands
} = require("../../Stores");

module.exports = function(client) {
    const setUpArr = [
        ["./js/discord/commands/normal", client.commands = new Discord.Collection()],
        ["./js/discord/commands/admin", client.admin = new Discord.Collection()],
        ["./js/discord/commands/master", client.master = new Discord.Collection()],
        ["./js/twitch/commands/", client.twitch = new Discord.Collection()]
    ]

    for (set of setUpArr) {
        const commandFiles = fs.readdirSync(`${set[0]}`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${set[0]}/${file}`);
            set[1].set(command.name, command);
        }
    }

    const FormatCommand = require("../../FormatCommand");
    const customCommands = jCommands.get("commands");
    if(customCommands) {
        for(command in customCommands) {
            let output = customCommands[command];
            client.commands.set(command.toUpperCase(), {
                name: command.toUpperCase(),
                description: { "info": "Custom command" },
                execute(msg, args) { 
                    return msg.channel.send(FormatCommand(msg, output)); 
                }
            });
        }
    }

    return "[Server][I]: Finished Command Set Up".sendLog();
};