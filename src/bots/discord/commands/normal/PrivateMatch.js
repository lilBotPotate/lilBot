const {
    Command,
    Universal
} = require("../../../../imports/Imports");

const {
    ioPrivateMatch
} = require("../../../../websockets/WebSockets");

module.exports = new Command.Normal()
      .setName("PM")
      .setInfo("Command For private matches!")
      .addSubCommand("JOIN", join)
      .addSubCommand("LEAVE", leave)
      .addSubCommand("LIST", list)
      .setCommand(list);

async function join(msg) {
    const username = msg.author.tag;
    const id = msg.author.id;
    const subscriber = await msg.member.roles.has(global.gConfig.discord.subscriber_role);
    let moderator = await msg.member.hasPermission("ADMINISTRATOR");
    if(!moderator) {
        for(const role of global.gConfig.discord.admin_roles) {
            if(await msg.member.roles.has(role)) {
                moderator = true;
                break;
            }
        }
    }

    const queue = await ioPrivateMatch.db.get("queue");
    if(!queue) queue = [];
    if(await queue.find(p => p.id == id)) return msg.reply("you are already in the queue!");

    await queue.push({
        username, id, subscriber, moderator,
        timeJoined: new Date().toISOString(),
        discord: true
    });

    msg.reply(`You are ${queue.length}. in the queue!`);

    await ioPrivateMatch.db.set("queue", queue);
    await ioPrivateMatch.io.emit("queue", queue);
    Universal.sendLog("info", "joinQueue");
}

async function leave(msg) {
    const id = msg.author.id;
    const queue = await ioPrivateMatch.db.get("queue");
    if(!queue) queue = [];
    const index = await queue.findIndex(p => p.id == id);
    if(index == -1) return msg.reply("you are not in the queue.")
    await queue.splice(index, 1);

    msg.reply("You were removed from the queue");

    await ioPrivateMatch.db.set("queue", queue);
    await ioPrivateMatch.io.emit("queue", queue);
    Universal.sendLog("info", "leaveQueue");
}

function list(msg) {
    const queue = ioPrivateMatch.db.get("queue") || 0;
    return msg.channel.send(`There are ${queue.length} players in the queue`);
}


