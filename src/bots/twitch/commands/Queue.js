const {
    Universal,
    Command
} = require("../../../imports/Imports");

const {
    jQueue
} = require("../../../imports/functions/Stores.js");

module.exports = new Command.Twitch()
      .setName("QUEUE")
      .setInfo("We want more 1v1s with lilPotate")
      .addUse("queue", "sends the message")
      .addSubCommand("JOIN", join)
      .addSubCommand("LEAVE", leave)
      .addSubCommand("CLEAR", clear)
      .addSubCommand("NEXT", next)
      .addSubCommand("START", start)
      .addSubCommand("STOP", stop)
      .addSubCommand("HELP", help)
      .setCommand(list);

function join(client, channel, tags) {
    if(!jQueue.get("up")) return client.say(channel, `@${tags.username} queue is closed...`);

    const password = Universal.generatePassword(5);
    const queueArr = jQueue.get("queue");
    const queueLen = queueArr && queueArr.length != 0 ? queueArr.length + 1: 1;

    if(queueArr) {
        for(q of queueArr) {
            if(q.id == tags["user-id"]) {
                return client.say(channel, `@${tags.username} you are already in the queue`);
            }
        }
    }

    jQueue.union("queue", {
        "username": tags["display-name"],
        "id": tags["user-id"],
        "twitchID": tags.username,
        "subscriber": tags.subscriber,
        "password": password
    });

    client.whisper(
        tags.username, 
        `You are ${queueLen}. in the queue. When its your turn, you will get notified in the chat. Join the private match with the following information: USERNAME: lilpotate, PASSWORD: ${password}`
    );

    `[Twitch][Queue] ${tags["display-name"]} joined the queue. Password: ${password}`.sendLog();
}

function leave(client, channel, tags) {
    const queueArr = jQueue.get("queue");

    for (let q = 0; q < queueArr.length; q++) {
        const userQ = queueArr[q];
        if(userQ.id == tags["user-id"]) {
            queueArr.splice(q, 1);
            jQueue.set("queue", queueArr);
            return client.say(channel, `@${tags.username} you were removed from the queue!`);
        }
    }
    return client.say(channel, `@${tags.username} you are not in the queue!`);
}

function clear(client, channel, tags) {
    if(!hasPermission(tags)) return;
    jQueue.set("queue", []);
    return client.say(channel, `@${tags.username} queue was cleared!`);
}

function next(client, channel, tags) {
    if(!hasPermission(tags)) return;

    const queueArr = jQueue.get("queue");
    if(!queueArr || queueArr.length < 1) return client.say(channel, "Queue is empty");
    const user = queueArr.shift();
    jQueue.set("queue", queueArr);

    const userInfo = `${user.subscriber ? "🥔" : ""} ${user.username.toUpperCase()}: ${user.password}`;

    for(const admin of global.gConfig.twitch.admins) {
        client.whisper(admin.name, userInfo);
    }
    
    if(user.discordID) global.gClientDiscord.users.get(user.discordID).send("You are **UP**");
    client.say(channel, `@${user.username} is next!`);
}

function start(client, channel, tags) {  
    if(!hasPermission(tags)) return;
    jQueue.set("up", true);
    client.say(channel, "Queue is open!");
}

function stop(client, channel, tags) {
    if(!hasPermission(tags)) return;
    jQueue.set("up", false);
    client.say(channel, "Queue is closed!");
}

function help(client, channel, tags) {
    client.say(
        channel, 
        `@${tags.username} commands: "!queue join", "!queue leave" and "!queue list"`
    );
}

function list(client, channel, tags) {
    const queueArr = jQueue.get("queue");
    if(!queueArr || queueArr.length <= 0) return client.say(channel, `@${tags.username} queue is empty`);
    client.say(channel, `QUEUE (${queueArr.length}): ${queueArr.map(u => u.username).join(", ")}`);
}

function hasPermission(tags) {
    for(const admin of global.gConfig.twitch.admins) {
        if(admin.id == tags["user-id"]) return true;
    }
    return false;
}