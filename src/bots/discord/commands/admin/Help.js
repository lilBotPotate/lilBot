const {
	Discord,
	Command,
	Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
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
	if(!client.admin.has(commandName)) return Universal.sendTemporary(msg, "That command doesn't exist!");
	const command = client.admin.get(commandName);
	const helpEmbed = new Discord.RichEmbed().setColor("RANDOM");
	if(command.name) helpEmbed.setTitle(`**${command.name}**`);
	if(command.info) helpEmbed.setDescription(`${command.info}`);
	if(command.uses) {
		const usageText = command.uses
						.map(u => `**${global.gConfig.prefixes.admin}${u.format}:** ${u.description}`)
						.join("\n");
		helpEmbed.addField("**USES:**", usageText);
	}

	return msg.channel.send(helpEmbed).catch();
}

function listAllCommands(client, msg) {
	const commandArr = client.admin
	.sort((a, b) => b.name - a.name)
	.map(cmd => {
		if(cmd.disabled) return `~~*${cmd.name}*~~`;
		return cmd.name;
	});

	const helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("**LIST OF ADMIN COMMANDS**")
		.setDescription(`**Prefix:** ${global.gConfig.prefixes.admin}`)
		.addField("**COMMANDS:**", `**${commandArr.join(", ")}**`);
	return msg.channel.send(helpEmbed).catch();
}