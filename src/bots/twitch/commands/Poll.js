const {
    Command,
    Universal
} = require("../../../imports/Imports");

const {
    ioPoll
} = require("../../../websockets/WebSockets");

module.exports = new Command.Twitch()
      .setName("POLL")
      .setInfo("Command for polls!")
      .setCommand(vote);

async function vote(client, channel, tags, args, self) {
    if(!args || args.length < 1) return Universal.sendTemporary(msg, "Missing arguments!");
    const poll = await ioPoll.db.get("poll") || {};
    if(!poll.name) return await client.say(channel, "No active poll...");
    const vote = args[0];
    if(vote == null) return;
    const options = poll.options;
    if(!options) return;
    
    const voter = await ioPoll.db.get(`voters.${tags["user-id"]}`);
    if(voter) {
        const index = await options.findIndex(o => o.id == voter);
        if(index === -1) return;
        const option = options[index];
        option.votes = option.votes - 1;
        options[index] = option;
    } else {
        poll.votes = poll.votes + 1;
    }

    const index = await options.findIndex(o => o.id == vote);
    if(index === -1) return;
    const option = options[index];
    option.votes = option.votes + 1;
    options[index] = option;

    poll.options = options;
    
    
    await client.whisper(
        tags.username, 
        `You have voted for ${vote}!`
    );

    await ioPoll.db.set(`voters.${tags["user-id"]}`, vote);
    await ioPoll.db.set("poll", poll);
    await ioPoll.io.emit("poll", poll);
}

