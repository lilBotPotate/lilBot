const { prefix } = require("../../../config.json");

module.exports = function(client, channel, tags, message, self, commands) {
    console.log(`${message} ${message.startsWith(prefix)}`);
    if(!message.startsWith(prefix)) return;
    const args = message.slice(prefix.length).split(/ +/);
    const command = args.shift().toUpperCase();
    console.log(commands.has(command));
    if(!commands.has(command)) return;
    try {
        `[Twitch]: ${tags.username} executed ${command} ${args}`.sendLog();
        return commands.get(command).execute(client, channel, tags, args, self);
    } catch (error) { error.sendLog(); }
};