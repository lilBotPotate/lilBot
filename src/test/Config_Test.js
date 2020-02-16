const {
    Universal
} = require("../imports/Imports");

exports.envTest = () => {
    const envPar = [
        "DISCORD_TOKEN", "TWITCH_TOKEN", "TWITCH_CLIENT_ID", 
        "STEAM_KEY", "GOOGLE_SUGGESTION_SHEET_ID", "GOOGLE_CREDENTIALS", 
        "GOOGLE_TOKEN", "API_PORT", "API_PASSWORD"
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
    Universal.sendLog("info", "ENV tests passed!");
}

exports.configTest = () => {
    const confParam = [
        "prefixes.normal", "prefixes.admin", "prefixes.master",
        "discord.default_role", "discord.subscriber_role", "discord.twitch_updates_chat", "discord.twitch_discord_chat", "discord.bot_owner_id", 
        "discord.admin_roles", "discord.admins",
        "twitch.username", "extra.default_steam_id", 
        "twitch.icons.no_badge", "twitch.icons.subscriber", "twitch.icons.moderator", "twitch.icons.sub_gifter", 
        "twitch.icons.partner", "twitch.icons.bits", "twitch.icons.premium", "twitch.icons.founder",
        "twitch.channels", "twitch.admins"
    ];

    for(let par of confParam) {
        const paramArr = par.split(".");
        let configVar = global.gConfig;
        for (let i = 0; i < paramArr.length; i++) {
            configVar = configVar[paramArr[i]]
            if(!configVar) {
                const error = `${par} is not defined in config.yaml`;
                throw new Error(error);
            }
            else if((typeof configVar === "string") && configVar.trim() === "") {
                const error = `${par} is empty inconfig.yaml`;
                throw new Error(error);
            }   
            else if((typeof configVar === "object") && configVar === {}) {
                const error = `${par} is empty inconfig.yaml`;
                throw new Error(error);
            }  
        }
    }

    Universal.sendLog("info", "ENV tests passed!");
}