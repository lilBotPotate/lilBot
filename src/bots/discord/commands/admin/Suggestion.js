const {
    Discord,
    google
} = require("../../../Imports.js");

module.exports = {
    name: "SUGGESTION",
    description: {
        "info": "Have a great idea? Share it!",
        "uses": {
            "suggestion {suggestion}": "send a suggestion"
        }
    },
    execute(msg, args) {
        if(!args || args.length < 1) return msg.channel.send("You need to insert your suggestion!");
        const username = msg.author.tag;
        const suggestion = args.join(" ");

        if(!global.gConfig.google_credentials) return console.log('Error loading client secret file:');
        return authorize(global.gConfig.google_credentials, (auth) => appendSuggestion(auth, msg, { username, suggestion }));
    }
};

function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );
    
    if(!global.gConfig.google_token) return console.log("No token");
    oAuth2Client.setCredentials(global.gConfig.google_token);
    callback(oAuth2Client);
}

function appendSuggestion(auth, msg, { username, suggestion }) {
    const sheets = google.sheets({
        version: "v4",
        auth
    });

    const values = [
        [username, suggestion]
    ];

    const resource = { values };
    
    const spreadsheetId = process.env.GOOGLE_SUGGESTION_SHEET_ID;
    
    sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A:B',
        valueInputOption: "USER_ENTERED",
        resource,
    }, (err, result) => {
        if (err) {
            msg.channel.send("Suggestion could not be added... :(");
            console.error(err);
        } else {
            sendSuggestionToChat({ msg, suggestion })
        }
    });
}

function sendSuggestionToChat({ msg, suggestion }) {
    const eSuggestion = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`Suggestion from **${msg.author.tag}**`)
        .setDescription(suggestion)
        .setThumbnail(msg.author.avatarURL);

    try {
        msg.channel.send(eSuggestion).then(async function(message) {
            await message.react("👍");
            await message.react("👎");
            await message.react("❌");
        }).catch();
        if(!msg.attachments.first()) msg.delete();
    } catch (error) {
        console.log(error);
    }
}