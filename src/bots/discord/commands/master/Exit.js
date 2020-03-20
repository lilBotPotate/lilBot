const {
	Discord,
	Command,
	Universal
} = require("../../../../imports/Imports");

module.exports = new Command.Master()
      .setName("Exit")
      .setInfo("Shut down bot")
      .addUse("exit", "shuts down the bot")
	  .setCommand(shutDown);

function shutDown(msg) {
	msg.channel.send("The bot is getting shut down.").then(() => {
		process.exit(-1);
	});
}