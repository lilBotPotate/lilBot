const {
    Command,
    Discord
} = require("../../../../imports/Imports");

const {
    ioTournament
} = require("../../../../websockets/WebSockets");

module.exports = new Command.Normal()
      .setName("TOURNAMENT")
      .setCommand(tournament);
      
async function tournament(msg) {
    const name = ioTournament.db.get("name");
    const password = ioTournament.db.get("password");

    if(!name || !password) return msg.channel.send("No active tournament");

    const subscriber = await msg.member.roles.has(global.gConfig.discord.subscriber_role);
    let moderator = await msg.member.hasPermission("ADMINISTRATOR");
    if(!moderator) {
        for(const role of global.gConfig.discord.admin_roles) {
            if(await msg.member.roles.has(role)) {
                moderator = true;
                break;
            }
        }
    }

    let canJoin = true;
    const filters = await ioTournament.db.get("filters") || [];
    if(filters.includes("subscriber") && !subscriber) canJoin = false;
    if(filters.includes("moderator") && !moderator) canJoin = false;
    
    if(canJoin) {
        const eTournament = new Discord.RichEmbed()
              .setColor("RANDOM")
              .setTitle(`**lilPotate's Tournament**`)
              .addField("**NAME**", name)
              .addField("**PASSWORD**", password);


        return msg.author.send(eTournament);
    }
}