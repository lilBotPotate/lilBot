const { prefix } = require("../../../config.json");

module.exports = function(client, channel, tags, message, self, commands) {
    if(!message.startsWith(prefix)) return;
    const args = message.slice(prefix.length).split(/ +/);
    const command = args.shift().toUpperCase();
    if(!commands.has(command)) return;
    try {
        `[Twitch]: ${tags.username} executed ${command} ${args}`.sendLog();
        return commands.get(command).execute(client, channel, tags, args, self);
    } catch (error) { error.sendLog(); }
};