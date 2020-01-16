const {
    Discord
} = require("../../../Imports.js");

module.exports = {
	name: "HELP",
	description: {
		"info": "lilBot to the rescue!",
		"uses": {
		  "help": "list all commands",
		  "help {command}": "get information about a specific command"
		}
	},
	execute(msg, args) {
		const client = global.gClientDiscord;
		if(args[0]) listCommand(client, msg, args[0].toUpperCase());
		else listAllCommands(client, msg);
	}
};

function listCommand(client, msg, command) {
	if(!client.master.has(command)) return "That command doesn't exist!".sendTemporary(msg);
	const commandJSON = client.master.get(command);
	const helpEmbed = new Discord.RichEmbed().setColor("RANDOM");
	
	if(commandJSON.name) helpEmbed.setTitle(`**${commandJSON.name}**`);
	if(commandJSON.description.info) helpEmbed.setDescription(`${commandJSON.description.info}`);
	
	if(commandJSON.aliases) helpEmbed.addField("**ALIASES:**", commandJSON.aliases.join(", "));
	
	const usesJSON = commandJSON.description.uses;
	if(usesJSON) {
		let usesList = "";
		for(use in usesJSON) {
			usesList += `**${global.gConfig.prefix_master}${use}:** ${usesJSON[use]}\n`;
		}
		helpEmbed.addField("**USES:**", usesList);
	}
	msg.channel.send(helpEmbed).catch();
}

function listAllCommands(client, msg) {
	let commandsArr = [];
	client.master.map(u => {
		if(u.name) {
			let comm = u.name;
			if(u.aliases) comm += ` (${u.aliases.join(", ")})`;
			return commandsArr.push(comm);
		}
	});

	const commands = `**${commandsArr.sort().join(", ")}**`;

	const helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("**LIST OF MASTER COMMANDS**")
		.setDescription(`**Prefix:** ${global.gConfig.prefix_master}`)
		.addField("**COMMANDS:**", commands);

	msg.channel.send(helpEmbed).catch();
}