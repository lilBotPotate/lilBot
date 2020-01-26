module.exports = function(reason) {
    const clientD = global.gClientDiscord;
    const botMaster = clientD.fetchUser(process.env.BOT_MASTER_DISCORD_ID);
    `[Server][T]: Disconnected: ${reason}`.sendLog();
    return botMaster.send(`[Server][T]: Disconnected: ${reason}`);
};