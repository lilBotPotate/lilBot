module.exports = function(client, channel, tags, message, self, commands) {
    if(global.gConfig.twitch_chat && global.gConfig.twitch_chat !== "") {
        if(tags.username.toUpperCase() !== global.gConfig.twitch_username.toUpperCase()) {
            const twitchMsg = `**[${tags.username}]:** ${message}`;
            if(global.gClientDiscord.channels.has(global.gConfig.twitch_chat)) {
                global.gClientDiscord.channels.get(global.gConfig.twitch_chat).send(twitchMsg);
            }
        }
    }

    if(!message.startsWith(global.gConfig.prefix)) return;
    const args = message.slice(global.gConfig.prefix.length).split(/ +/);
    const command = args.shift().toUpperCase();
    if(!commands.has(command)) return;
    try {
        `[T]: ${tags.username} executed ${global.gConfig.prefix}${command} ${args}`.sendLog();
        return commands.get(command).execute(client, channel, tags, args, self);
    } catch (error) { error.sendLog(); }
};