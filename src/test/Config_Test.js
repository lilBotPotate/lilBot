exports.checkEnv = () => {
    const envPar = [
        "DISCORD_TOKEN", "TWITCH_TOKEN", "TWITCH_CLIENT_ID", "STEAM_KEY", "GOOGLE_SUGGESTION_SHEET_ID", 
        "PREFIX", "PREFIX_ADMIN", "PREFIX_MASTER", "TWITCH_USERNAME", "DEFAULT_DISCORD_ROLE", 
        "SUBSCRIBER_DISCORD_ROLE", "LILPOTATE_LIVE_CHANNEL", "TWITCH_DISCORD_CHAT", "BOT_MASTER_DISCORD_ID", 
        "TWITCH_CHANNEL", "DEFAULT_STEAM_ID"
    ];

    for(par of envPar) {
        if(!process.env[par]) {
            const error = `${par} is not defined in .env`;
            throw new Error(error);
        }
        else if(process.env[par].trim() === "") {
            const error = `${par} is empty in .env`;
            throw new Error(error);
        }
    }

    console.log("ENV tests passed!");
}

// lilBunane