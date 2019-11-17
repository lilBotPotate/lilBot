const {
    GFun
} = require("../../Imports.js");

const {
    jQueue
} = require("../../Stores.js");

const {
    clientDiscord
} = require("../../Clients.js");

const { twitch_admins } = require("../../../config.json");

module.exports = {
    name: "QUEUE",
    execute(client, channel, tags, args, self) {
        if(tags["message-type"] != "chat") return client.whisper(tags.username, "I don't do DM's...");

        const command = args[0] ? args.shift().toUpperCase() : "LIST";
        switch(command) {
            case "JOIN": return join(client, tags, channel);
            case "LEAVE": return leave(client, tags, channel);
            case "EMPTY":
            case "CLEAR": return clear(client, tags, channel);
            case "NEXT": return next(client, tags, channel);
            case "OPEN":
            case "START": return start(client, tags, channel);
            case "CLOSE":
            case "STOP": return stop(client, tags, channel);
            case "HELP": return help(client, tags, channel);
            case "LIST":
            default: return list(client, tags, channel);
        }
    }
};

function join(client, tags, channel) {
    if(!jQueue.get("up")) return client.say(channel, `@${tags.username} queue is closed...`);

    const password = GFun.generatePassword(5);
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

function leave(client, tags, channel) {
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

function clear(client, tags, channel) {
    if(!hasPermission(tags)) return;
    jQueue.set("queue", []);
    return client.say(channel, `@${tags.username} queue was cleared!`);
}

function next(client, tags, channel) {
    if(!hasPermission(tags)) return;

    const queueArr = jQueue.get("queue");
    if(!queueArr || queueArr.length < 1) return client.say(channel, "Queue is empty");
    const user = queueArr.shift();
    jQueue.set("queue", queueArr);

    const userInfo = `${user.subscriber ? "🥔" : ""} ${user.username.toUpperCase()}: ${user.password}`;

    for(a in twitch_admins) {
        client.whisper(a, userInfo);
    }
    
    if(user.discordID) clientDiscord().users.get(user.discordID).send("You are **UP**");
    client.say(channel, `@${user.username} is next!`);
}

function start(client, tags, channel) {  
    if(!hasPermission(tags)) return;
    jQueue.set("up", true);
    client.say(channel, "Queue is open!");
}

function stop(client, tags, channel) {
    if(!hasPermission(tags)) return;
    jQueue.set("up", false);
    client.say(channel, "Queue is closed!");
}

function help(client, tags, channel) {
    client.say(
        channel, 
        `@${tags.username} commands: "!queue join", "!queue leave" and "!queue list"`
    );
}

function list(client, tags, channel) {
    const queueArr = jQueue.get("queue");
    if(!queueArr || queueArr.length <= 0) return client.say(channel, `@${tags.username} queue is empty`);
    client.say(channel, `QUEUE (${queueArr.length}): ${queueArr.map(u => u.username).join(", ")}`);
}

function hasPermission(tags) {
    for(i in twitch_admins) if(twitch_admins[i] == tags["user-id"]) return true;
    return false;
}