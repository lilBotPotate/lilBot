const {
	Discord,
	Command	
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
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
	if(!client.admin.has(command)) return "That command doesn't exist!".sendTemporary(msg);
	const commandJSON = client.admin.get(command);
	const helpEmbed = new Discord.RichEmbed().setColor("RANDOM");
	if(commandJSON.name) helpEmbed.setTitle(`**${commandJSON.name}**`);
	if(commandJSON.description.info) helpEmbed.setDescription(`${commandJSON.description.info}`);
	if(commandJSON.aliases) helpEmbed.addField("**ALIASES:**", commandJSON.aliases.join(", "));
	const usesJSON = commandJSON.description.uses;
	if(usesJSON) {
		let usesList = "";
		for(use in usesJSON) {
			usesList += `**${global.gConfig.prefixes.admin}${use}:** ${usesJSON[use]}\n`;
		}
		helpEmbed.addField("**USES:**", usesList);
	}

	return msg.channel.send(helpEmbed).catch();
}

function listAllCommands(client, msg) {
	const commandArr = client.admin.map(cmd => {
		if(cmd.disabled) return `~~*${cmd.name}*~~`;
		return cmd.name;
	});

	const helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("**LIST OF ADMIN COMMANDS**")
		.setDescription(`**Prefix:** ${global.gConfig.prefixes.admin}`)
		.addField("**COMMANDS:**", `**${commandArr.sort().join(", ")}**`);
	return msg.channel.send(helpEmbed).catch();
}