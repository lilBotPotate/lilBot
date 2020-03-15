const {
    Command,
    Universal
} = require("../../../imports/Imports");

const {
    ioPrivateMatch
} = require("../../../websockets/WebSockets");

module.exports = new Command.Twitch()
      .setName("PM")
      .setInfo("Command For private matches!")
      .addSubCommand("JOIN", join)
      .addSubCommand("LEAVE", leave)
      .addSubCommand("LIST", list)
      .setCommand(list);

async function join(client, channel, tags) {
    const queue = await ioPrivateMatch.db.get("queue");
    if(!queue) queue = [];
    if(await queue.find(p => p.id == tags["user-id"])) return;

    await queue.push({ 
        username: tags["display-name"],
        id: tags["user-id"], 
        subscriber: tags.subscriber, 
        moderator: tags.mod,
        twitch: true
    });

    await client.whisper(
        tags.username, 
        `You are ${queue.length}. in the queue!`
    );

    await ioPrivateMatch.db.set("queue", queue);
    await ioPrivateMatch.io.emit("queue", queue);
    Universal.sendLog("info", "joinQueue");
}

async function leave(client, channel, tags) {
    const id = tags["user-id"];
    const queue = await ioPrivateMatch.db.get("queue");
    if(!queue) queue = [];
    const index = await queue.findIndex(p => p.id == id);
    if(index == -1) return;
    await queue.splice(index, 1);

    await client.whisper(
        tags.username, 
        "You were removed from the queue"
    );

    await ioPrivateMatch.db.set("queue", queue);
    await ioPrivateMatch.io.emit("queue", queue);
    Universal.sendLog("info", "leaveQueue");
}

function list(client, channel) {
    const queue = ioPrivateMatch.db.get("queue") || 0;
    return client.say(channel, `There are ${queue.length} players in the queue`);
}



