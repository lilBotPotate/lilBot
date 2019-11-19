const {
    request
} = require("./Imports.js");

let twitchLive = false;

module.exports = function() {
    return checkTwitch();
};

async function checkTwitch() {
    let jStream = await getJSON(`https://api.twitch.tv/helix/streams?user_login=lilpotate`);

    if(jStream.data.length > 0) {
        if(twitchLive) return;
        twitchLive = true;
        const message = "@everyone **lilPotate** is now live! Come join us! <:lilpotHypebot:642086734774927363>";
        try {
            return await global.gClientDiscord.channels.get(global.gConfig.live_channel).send(message).then(m => {
                return global.gClientDiscord.commands.get("TWITCH").execute(m, []);
            }); 
        } catch (error) { `[Error]: ${error}`}
    } 
    else if(twitchLive) { twitchLive = false; }

    function getJSON(url) {
        return new Promise(function (resolve, reject) {
            request({
                headers: { "Client-ID": global.gConfig.client_id },
                uri: url,
                method: "GET",
                json: true
            }, function (error, res, body) {
                if (!error && res.statusCode == 200) resolve(body);
                else reject(error);
            });
        });
    }
}