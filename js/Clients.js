let clientDiscord, clientTwitch;
module.exports = { 
    clientDiscord: function() { return clientDiscord },
    clientTwitch: function() { return clientTwitch },

    SetDiscord: function (client) {
        "[Server]: Discord client is set".sendLog();
        clientDiscord = client;
        return;
    },
    
    SetTwitch: function (client) {
        "[Server]: Twitch client is set".sendLog();
        clientTwitch = client;
        return;
    }
}