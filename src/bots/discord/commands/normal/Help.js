const {
	Discord,
	Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("HELP")
      .setInfo("lilBot to the rescue!")
      .addUsage("help", "list all commands")
      .addUsage("help {command}", "get information about a specific command")
	  .setCommand(sendHelp);

function sendHelp(msg, args) {
	const client = global.gClientDiscord;
	if(args[0]) listCommand(client, msg, args[0].toUpperCase());
	else listAllCommands(client, msg);
}

function listCommand(client, msg, command) {
	if(!client.commands.has(command)) return "That command doesn't exist!".sendTemporary(msg);
	const commandJSON = client.commands.get(command);
	const helpEmbed = new Discord.RichEmbed().setColor("RANDOM");
	
	if(commandJSON.name) helpEmbed.setTitle(`**${commandJSON.name}**`);
	if(commandJSON.description.info) helpEmbed.setDescription(`${commandJSON.description.info}`);
	
	if(commandJSON.aliases) helpEmbed.addField("**ALIASES:**", commandJSON.aliases.join(", "));
	
	const usesJSON = commandJSON.description.uses;
	if(usesJSON) {
		let usesList = "";
		for(use in usesJSON) {
			usesList += `**${global.gConfig.prefixes.normal}${use}:** ${usesJSON[use]}\n`;
		}
		helpEmbed.addField("**USES:**", usesList);
	}
	msg.channel.send(helpEmbed).catch();
}

function listAllCommands(client, msg) {
	let commandsArr = [];
	client.commands.map(u => {
		if(u.name) {
			let comm = u.name;
			if(u.aliases) comm += ` (${u.aliases.join(", ")})`;
			return commandsArr.push(comm);
		}
	});

	const commands = `**${commandsArr.sort().join(", ")}**`;

	const helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("**LIST OF COMMANDS**")
		.setDescription(`**Prefix:** ${global.gConfig.prefixes.normal}`)
		.addField("**COMMANDS:**", commands);

	msg.channel.send(helpEmbed).catch();
}