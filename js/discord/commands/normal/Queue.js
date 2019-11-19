const {
    Discord,
    GFun
} = require("../../../Imports.js");

const {
    jQueue
} = require("../../../Stores.js");

module.exports = {
    name: "QUEUE",
    description: {
        "info": "We want more 1v1s with lilPotate!",
        "uses": {
            "queue": "list all people in the queue",
            "queue join": "join the queue",
            "queue leave": "leave the queue",
            "queue clear": "clear queue",
            "queue next": "returns the next person in queue",
            "queue start": "opens the queue",
            "queue stop": "closes the queue"
        }
    },
    execute(msg, args) {
        const command = args[0] ? args.shift().toUpperCase() : "LIST";
        switch (command) {
            case "JOIN": return join(msg);
            case "LEAVE": return leave(msg);
            case "EMPTY":
            case "CLEAR": return clear(msg);
            case "NEXT": return next(msg);
            case "OPEN":
            case "START": return start(msg);
            case "CLOSE":
            case "STOP": return stop(msg);
            case "LIST":
            default: return list(msg);
        }
    }
};

function join(msg) {
    if(!jQueue.get("up")) return msg.channel.send("Queue is closed...");

    const password = GFun.generatePassword(5);
    const queueArr = jQueue.get("queue");
    const queueLen = queueArr && queueArr.length != 0 ? queueArr.length + 1: 1;

    if(queueArr) {
        for(q of queueArr) {
            if(q.discordID == msg.author.id) {
                return msg.channel.send("You are already in the queue!");
            }
        }
    }

    jQueue.union("queue", {
        "username": msg.author.username,
        "discordID": msg.author.id,
        "subscriber": false,
        "password": password
    });

    const queueEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`You are **${queueLen}.** in the queue!`)
        .setDescription(`When its your turn, you will get notified in the chat. Join the private match with the following information:\n**USERNAME: lilpotate**\n**PASSWORD: ${password}**`);

    msg.author.send(queueEmbed);

    `[Discord][N][Queue] ${msg.author.username} joined the queue. Password: ${password}`.sendLog();
}

function leave(msg) {
    const queueArr = jQueue.get("queue");

    for (let q = 0; q < queueArr.length; q++) {
        const userQ = queueArr[q];
        if(userQ.discordID == msg.author.id) {
            queueArr.splice(q, 1);
            jQueue.set("queue", queueArr);
            return msg.channel.send(`You were **REMOVED** from the queue`);
        }
    }
    return msg.channel.send("You are not in the queue!");
}

function clear(msg) {
    if(!hasPermission(msg)) return msg.channel.send("You don't have permission to use that command!");
    jQueue.set("queue", []);
    return msg.channel.send("Queue was cleared!");
}

function next(msg) {
    if(!hasPermission(msg)) return msg.channel.send("You don't have permission to use that command!");
    
    const queueArr = jQueue.get("queue");
    if(!queueArr || queueArr.length < 1) return msg.channel.send("Queue is empty");
    const user = queueArr.shift();
    jQueue.set("queue", queueArr);

    const playerEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**${user.username.toUpperCase()} ${user.subscriber ? ":star:" : ""}**`)
        .setDescription(`**${user.password}**`);

    msg.author.send(playerEmbed);

    if(user.discordID) global.gClientDiscord.users.get(user.discordID).send("You are **UP**!");
    global.gClientTwitch.say("lilpotate", `@${user.username} is next!`);
}

function start(msg) {
    if(!hasPermission(msg)) return msg.channel.send("You don't have permission to use that command!");
    jQueue.set("up", true);
    msg.channel.send("Queue is open!");
}

function stop(msg) {
    if(!hasPermission(msg)) return msg.channel.send("You don't have permission to use that command!");
    jQueue.set("up", false);
    msg.channel.send("Queue is closed!");
}

function list(msg) {
    const queueArr = jQueue.get("queue");
    if(!queueArr || queueArr.length <= 0) return msg.channel.send("Queue is empty");
    msg.channel.send(`**QUEUE (${queueArr.length}):** ${queueArr.map(u => u.username).join(", ")}`);
}

function hasPermission(msg) {
    for(i in global.gConfig.disord_admins) if(global.gConfig.disord_admins[i] == msg.author.id) return true;
    return false;
}