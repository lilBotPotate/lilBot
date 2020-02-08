const {
	Discord,
	Command,
	Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("HELP")
      .setInfo("lilBot to the rescue!")
      .addUse("help", "list all commands")
      .addUse("help {command}", "get information about a specific command")
	  .setCommand(sendHelp);

function sendHelp(msg, args) {
	const client = global.gClientDiscord;
	if(args[0]) listCommand(client, msg, args[0].toUpperCase());
	else listAllCommands(client, msg);
}

function listCommand(client, msg, commandName) {
	if(!client.commands.has(commandName)) return Universal.sendTemporary(msg, "That command doesn't exist!");
	const command = client.commands.get(commandName);
	const helpEmbed = new Discord.RichEmbed().setColor("RANDOM");
	if(command.name) helpEmbed.setTitle(`**${command.disabled ? `~~${command.name}~~` : command.name}**`);
	const description = command.disabled
					  ? `This command is disabled. Reason: **${command.reason}**\n`
					  : command.info;
	if(description) helpEmbed.setDescription(description);
	if(command.uses && command.uses.length > 1) {
		const usageText = command.uses
						.map(u => `**${global.gConfig.prefixes.normal}${u.format}:** ${u.description}`)
						.join("\n");
		helpEmbed.addField("**USES:**", usageText);
	}

	return msg.channel.send(helpEmbed).catch();
}

function listAllCommands(client, msg) {
	const commandArr = client.commands
	.sort((a, b) => b.name - a.name)
	.map(cmd => {
		if(cmd.disabled) return `~~*${cmd.name}*~~`;
		return cmd.name;
	});

	const helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("**LIST OF COMMANDS**")
		.setDescription(`**Prefix:** ${global.gConfig.prefixes.normal}`)
		.addField("**COMMANDS:**", `**${commandArr.join(", ")}**`);
	return msg.channel.send(helpEmbed).catch();
}