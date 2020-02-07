const {
    Discord,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("WINNER")
      .setInfo("Ohhhh whats the prize going to be :o")
      .addUsage("winner", "select a random person on the server")
      .addUsage("winner subs", "select a random subscriber on the server")
      .setCommand(selectWinner);

function selectWinner(msg, args) {
    const onlySubs = args.length > 0 ? args.shift().toUpperCase() === "SUBS" : false;
    const members = msg.guild.members
    .filter(member => {
        const subsCheck = onlySubs
                        ? member.roles.has(global.gConfig.discord.subscriber_role)
                        : true;
        return (member.id !== msg.author.id) && !member.user.bot && subsCheck
    })
    .map(member => member.user);
    
    const winner = members[Math.floor(Math.random() * members.length)];
    const eWinner = new Discord.RichEmbed()
                    .setColor("#e5c100")
                    .setTitle(`**${winner.username}** is the **WINNER**!`)
                    .setDescription("Congrats! You are the chosen one!")
                    .setThumbnail(winner.avatarURL);
    msg.channel.send(`${winner} `, {embed: eWinner});
}