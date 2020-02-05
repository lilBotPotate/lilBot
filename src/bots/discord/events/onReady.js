const {
    Universal
} = require("../../../modules/Imports");

module.exports = function(member) {
    const botName = this.user.tag;
    const numUsers = this.users.size;
    const numChannels = this.channels.size;
    const numGuilds = this.guilds.size;

    return Universal.sendLog(
        "info", 
        `Discord client logged in as ${botName} (${numUsers} users, ${numChannels} channels, ${numGuilds} guilds)`
    );
};