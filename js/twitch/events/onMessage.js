module.exports = function(channel, tags, message, self) {
    sendToDiscord(tags, message);

    if(!message.startsWith(process.env.PREFIX)) return;
    const args = message.slice(process.env.PREFIX.length).split(/ +/);
    const command = args.shift().toUpperCase();
    if(!this.commands.has(command)) return;
    try {
        `[T]: ${tags.username} executed ${process.env.PREFIX}${command} ${args}`.sendLog();
        return this.commands.get(command).execute(this, channel, tags, args, self);
    } catch (error) { error.sendLog(); }
};

function sendToDiscord(tags, message) {
    if(tags.username.toUpperCase() !== process.env.TWITCH_USERNAME.toUpperCase()) {
        let badges = "";
        if(tags.badges != null) {
            for(let badege in tags.badges) {
                const badgeIcon = global.gConfig.twitch_icons[badege];
                if(badgeIcon) badges += `${badgeIcon} `;
            }
        } 
        if(badges === "") badges = `${global.gConfig.twitch_icons["no-badge"]}`;

        const username = tags["display-name"] ? tags["display-name"] : tags.username;
        const twitchMsg = `${badges !== "" ? badges : ""}**${username}**: ` + "`" + message + "`";
        if(global.gClientDiscord.channels.has(process.env.TWITCH_DISCORD_CHAT)) {
            global.gClientDiscord.channels.get(process.env.TWITCH_DISCORD_CHAT).send(twitchMsg);
        }
    }
}