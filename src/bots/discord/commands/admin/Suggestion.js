const {
    Discord,
    google,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("SUGGESTION")
      .setInfo("Have a great idea? Share it!")
      .addUsage("suggestion {suggestion}", "send a suggestion")
      .setCommand(makeSuggestion);

function makeSuggestion(msg, args) {
    if(!args || args.length < 1) return msg.channel.send("You need to insert your suggestion!");
    const username = msg.author.tag;
    const suggestion = args.join(" ");
    return authorize(JSON.parse(process.env.GOOGLE_CREDENTIALS), (auth) => appendSuggestion(auth, msg, { username, suggestion }));
}

function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );

    oAuth2Client.setCredentials(JSON.parse(process.env.GOOGLE_TOKEN));
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