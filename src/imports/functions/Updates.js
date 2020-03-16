const {
    Universal
} = require("../Imports");

let twitchLive = false;

module.exports = function() {
    return checkTwitch();
};

async function checkTwitch() {
    let jStream = await Universal.getData(
        `https://api.twitch.tv/helix/streams?user_login=lilpotate`,
        {
            json: true,
            headers: { "Client-ID": process.env.TWITCH_CLIENT_ID }
        }
    );

    if(jStream.data.length > 0) {
        if(twitchLive) return;
        twitchLive = true;
        const message = "@everyone **lilPotate** is now live! Come join us! <:lilpotHypebot:642086734774927363>";
        try {
            return await global.gClientDiscord.channels.get(global.gConfig.discord.twitch_updates_chat).send(message).then(m => {
                return global.gClientDiscord.commands.get("TWITCH").execute(m, []);
            }); 
        } catch (error) { Universal.sendLog("error", `Failed to send twitch notification:\n${error}`); }
    } 
    else if(twitchLive) { twitchLive = false; }
}