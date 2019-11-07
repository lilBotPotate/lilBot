const {
    request
} = require("./Imports.js");

const { client_id, live_channel } = require("../config.json");

let twitchLive = false;

module.exports = function(client) {
    checkTwitch(client);
};

async function checkTwitch(client) {
    let jStream = await getJSON(`https://api.twitch.tv/helix/streams?user_login=lilpotate`);

    if(jStream.data.length > 0) {
        if(twitchLive) return;
        twitchLive = true;
        const message = "**lilPotate** is going live! Run!!!";
        try {
            return await client.channels.get(live_channel).send(message).then(m => {
                return client.commands.get("TWITCH").execute(client, m, []);
            }); 
        } catch (error) { `[Error]: ${error}`}
    } 
    else if(twitchLive) { twitchLive = false; }

    function getJSON(url) {
        return new Promise(function (resolve, reject) {
            request({
                headers: { "Client-ID": client_id },
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