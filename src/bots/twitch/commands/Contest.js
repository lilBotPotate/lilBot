const {
    Command
} = require("../../../imports/Imports");

const {
    ioContest   
} = require("../../../websockets/WebSockets");

module.exports = new Command.Twitch()
      .setName("CONTEST")
      .setInfo("Contest command")
      .addUse("contest", "join contest")
      .addSubCommand("JOIN", join)
      .addSubCommand("LEAVE", leave)
      .addSubCommand("LIST", list)
      .setCommand(list);

async function join(client, channel, tags) {
    const participant = { 
        username: tags["display-name"],
        id: tags["user-id"], 
        subscriber: tags.subscriber, 
        moderator: tags.mod
    };

    const queue = await ioContest.db.get("queue") || [];
    await queue.push(participant);

    await ioContest.db.set("queue", queue);
    await ioContest.io.emit("queue", queue);

    return await client.whisper(
        tags.username, 
        `You are participating in the contest!`
    );
}

async function leave(client, channel, tags) {
    let queue = await ioContest.db.get("queue") || [];
    queue = await queue.filter(q => !(q.id == tags["user-id"]));

    await ioContest.db.set("queue", queue);
    await ioContest.io.emit("queue", queue);

    return await client.whisper(
        tags.username, 
        `You are not participating in the contest!`
    );
}

function list(client, channel) {
    const queue = ioContest.db.get("queue") || [];
    const filters = ioContest.db.get("filters") || [];

    const filteredQueue = queue.filter(p => {
        for(const f of filters) if(!p[f]) return false;
        return true;
    });

    return client.say(
        channel, 
        `${filteredQueue.length} participants! ${ filters.length > 0 ? `Filters: ${filters.join(", ")}` : ""}`
    );
}
