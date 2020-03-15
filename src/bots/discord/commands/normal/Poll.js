const {
    Command,
    Universal,
    Discord
} = require("../../../../imports/Imports");

const {
    ioPoll
} = require("../../../../websockets/WebSockets");

module.exports = new Command.Normal()
      .setName("POLL")
      .setInfo("Command for polls!")
      .addSubCommand("VOTES", votes)
      .setCommand(vote);

async function vote(msg, args) {
    if(!args || args.length < 1) return Universal.sendTemporary(msg, "Missing arguments!");
    const poll = await ioPoll.db.get("poll") || {};
    if(!poll.name) return msg.reply("No active poll...");
    const vote = args[0];
    if(vote == null) return msg.reply("Missing vote value!");
    const options = poll.options;
    if(!options) return msg.reply("Poll is not open!");

    const voter = await ioPoll.db.get(`voters.${msg.author.id}`);
    if(voter) {
        const index = await options.findIndex(o => o.id == voter);
        if(index === -1) return msg.reply("That option desn't exist!");
        const option = options[index];
        option.votes = option.votes - 1;
        options[index] = option;
    } else {
        poll.votes = poll.votes + 1;
    }

    const index = await options.findIndex(o => o.id == vote);
    if(index === -1) return msg.reply("That option desn't exist!");
    const option = options[index];
    option.votes = option.votes + 1;
    options[index] = option;

    poll.options = options;
    
    await ioPoll.db.set(`voters.${msg.author.id}`, vote);
    await ioPoll.db.set("poll", poll);
    await ioPoll.io.emit("poll", poll);
}

function votes(msg) {
    const poll = ioPoll.db.get("poll") || {};
    if(!poll.name || !poll.votes || !poll.options) return msg.channel.send("No active poll!");
    const eVotes = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setTitle(`**${poll.name}**`)
                .setDescription(`Total votes: ${poll.votes}`)
                .addField(
                    "**OPTIONS**", 
                    poll.options.map(o => `[${o.id}]: ${o.name} (${o.votes} votes)`)
                        .join("\n")
                );

    return msg.channel.send(eVotes);
}

