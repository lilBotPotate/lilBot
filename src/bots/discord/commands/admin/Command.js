const {
    Command 
} = require("../../../../imports/Imports");

const {
    jCommands
} = require("../../../../imports/functions/Stores");

module.exports = new Command.Admin()
      .setName("COMMAND")
      .setInfo("Are my default commands not good enough for you :cry:")
      .addUse("command add {name} {output}", "adds the command. Parameters:\n**-m**: mention\n**-u**: user who used the command")
      .addUse("command remove {name}", "removes the command")
      .addSubCommand("ADD", add)
      .addSubCommand("REMOVE", remove);

function add(msg, args) {
    const name = args.shift().toUpperCase();
    const output = args.join(" ");
    if(global.gClientDiscord.commands.has(name)) return msg.channel.send("That command already exists!");
    if(!output) return msg.channel.send("You need to enter the output of the command");
    const FormatCommand = require("../../../../imports/functions/FormatCommand");
    jCommands.set(`commands.${name}`, output);
    global.gClientDiscord.commands.set(name, new Command.Normal()
          .setName(name)
          .setInfo("This is a custom command")
          .addUse(name.toLowerCase(), output)
          .setCommand((msg) => msg.channel.send(FormatCommand(msg, output)))
    );
    return msg.channel.send(`Command **${name}** was added!`);
}

function remove(msg, args) {
    const client = global.gClientDiscord;
    const name = args.shift().toUpperCase();
    if(!client.commands.has(name)) return msg.channel.send("That command doesn't exists!");
    if(!jCommands.has(`commands.${name}`)) return msg.channel.send("You can't remove that command!");
    client.commands.delete(name);
    jCommands.del(`commands.${name}`);
    return msg.channel.send(`Command **${name}** was removed!`);
}