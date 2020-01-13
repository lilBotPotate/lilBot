module.exports = function(client, channel, tags, message, self, commands) {
    sendToDiscord(tags, message);

    if(!message.startsWith(global.gConfig.prefix)) return;
    const args = message.slice(global.gConfig.prefix.length).split(/ +/);
    const command = args.shift().toUpperCase();
    if(!commands.has(command)) return;
    try {
        `[T]: ${tags.username} executed ${global.gConfig.prefix}${command} ${args}`.sendLog();
        return commands.get(command).execute(client, channel, tags, args, self);
    } catch (error) { error.sendLog(); }
};

function sendToDiscord(tags, message) {
    if(tags.username.toUpperCase() !== global.gConfig.twitch_username.toUpperCase()) {
        let badges = "";
        for(let badege in tags.badges) {
            const badgeIcon = global.gConfig.twitch_icons[badege];
            if(badgeIcon) badges += `${badgeIcon} `;
        }

        const username = tags["display-name"] ? tags["display-name"] : tags.username;
        const twitchMsg = `${badges !== "" ? badges : ""}**${username}**: ` + "`" + message + "`";
        if(global.gClientDiscord.channels.has(global.gConfig.twitch_chat)) {
            global.gClientDiscord.channels.get(global.gConfig.twitch_chat).send(twitchMsg);
        }
    }
}