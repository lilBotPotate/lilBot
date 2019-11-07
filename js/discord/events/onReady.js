module.exports = function() {
    const client = this;
    const info = `(${client.users.size} users, ${client.channels.size} channels, ${client.guilds.size} guilds)`;
    `[Server]: Logged in as ${client.user.tag} ${info}`.sendLog();
    client.user.setActivity("Mention me for help :)", {
        type: "WATCHING"
    });
};