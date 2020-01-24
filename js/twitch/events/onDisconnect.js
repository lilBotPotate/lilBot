module.exports = function(reason) {
    const clientD = global.gClientDiscord;
    const botMaster = clientD.fetchUser(global.gConfig.bot_master_id);
    `[Server][T]: Disconnected: ${reason}`.sendLog();
    return botMaster.send(`[Server][T]: Disconnected: ${reason}`);
};