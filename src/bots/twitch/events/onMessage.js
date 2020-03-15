const {
    ioContest   
} = require("../../../websockets/WebSockets");

module.exports = function(channel, tags, message, self) {
    sendToWebsite(tags, message);
    sendToDiscord(tags, message);
    if(!message.startsWith(global.gConfig.prefixes.normal)) return;
    const args = message.slice(global.gConfig.prefixes.normal.length).split(/ +/);
    const command = args.shift().toUpperCase();
    if(!this.commands.has(command)) return;
    return this.commands.get(command).execute(this, channel, tags, args, self);
};

function sendToDiscord(tags, message) {
    if(tags.username.toUpperCase() !== global.gConfig.twitch.username.toUpperCase()) {
        let badges = "";
        if(tags.badges != null) {
            for(let badge in tags.badges) {
                const badgeIcon = global.gConfig.twitch.icons[badge];
                if(badgeIcon) badges += `${badgeIcon} `;
            }
        } 
        if(badges === "") badges = `${global.gConfig.twitch.icons["no-badge"]}`;
        const username = tags["display-name"] ? tags["display-name"] : tags.username;
        const twitchMsg = `${badges !== "" ? badges : ""}**${username}**: ` + "`" + message + "`";
        if(global.gClientDiscord.channels.has(global.gConfig.discord.twitch_discord_chat)) {
            global.gClientDiscord.channels.get(global.gConfig.discord.twitch_discord_chat).send(twitchMsg);
        }
    }
}

async function sendToWebsite(tags, message) {
    const winner = await ioContest.db.get("winner");
    if(!winner || !winner.id) return;
    if(tags["user-id"] != winner.id) return;

    const messages = await ioContest.db.get("messages") || [];
    if(messages.length >= 20) messages.shift();
    messages.push(message);

    ioContest.db.set("messages", messages);
    ioContest.io.emit("messages", messages);
}