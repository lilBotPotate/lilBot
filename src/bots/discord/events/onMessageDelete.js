const { Discord } = require("../../../imports/Imports");

module.exports = function (msg) {
  const adminLogChannel = msg.guild.channels.find(
    (channel) => channel.id == global.gConfig.discord.admin_log_chat
  );
  const eDeletedMessage = new Discord.RichEmbed().setColor("#cc0000").setTitle(`Message Deleted`).setDescription(`<@${msg.author.id}>\n${msg.content}`);
  if (adminLogChannel) adminLogChannel.send(eDeletedMessage);
};
