const {
    Command
} = require("../../../imports/Imports");

const {
    ioTournament
} = require("../../../websockets/WebSockets");

module.exports = new Command.Twitch()
               .setName("TOURNAMENT")
               .setCommand(tournament);

async function tournament(client, channel, tags) {    
    const name = await ioTournament.db.get("name");
    const password = await ioTournament.db.get("password");

    if(!name || !password) return;

    let canJoin = true;
    const filters = await ioTournament.db.get("filters") || [];
    if(await filters.includes("subscriber") && !tags.subscriber) canJoin = false;
    if(await filters.includes("moderator") && !tags.mod) canJoin = false;
    
    if(canJoin) {
        return client.whisper(
            tags.username, 
            `lilPotate's Tournament! Name: ${name}, Password: ${password}`
        );
    }
}               
