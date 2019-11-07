const {
    jCommands
} = require("../../../Stores.js");

module.exports = {
    name: "COMMAND",
    description: {
        "info": "Are my default commands not good enough for you :cry:",
        "uses": {
            "command add {name} {output}": "adds the command",
            "command remove {name}": "removes the command"
        }
    },
    execute(client, msg, args) {
        const command = args.shift().toUpperCase();
        switch(command) {
            case "ADD": return add(client, msg, args);
            case "REMOVE": return remove(client, msg, args);
            default: return;
        }
    }
};

function add(client, msg, args) {
    const name = args.shift().toUpperCase();
    const output = args.join(" ");

    if(client.commands.has(name)) return msg.channel.send("That command allready exists!");
    if(!output) return msg.channel.send("You need to enter the output of the command");

    jCommands.set(`commands.${name}`, output);
    client.commands.set(name, {
        name: name,
        description: { "info": "Custom command" },
        execute(client, msg, args) { return msg.channel.send(output); }
    });

    msg.channel.send(`Command **${name}** was added!`);
}

function remove(client, msg, args) {
    const name = args.shift().toUpperCase();
    if(!client.commands.has(name)) return msg.channel.send("That command doesn't exists!");
    if(!jCommands.has(`commands.${name}`)) return msg.channel.send("You can't remove that command!");
    client.commands.delete(name);
    jCommands.del(`commands.${name}`);

    msg.channel.send(`Command **${name}** was removed!`);
}