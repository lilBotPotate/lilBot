const {
    Discord
} = require("../../../modules/Imports");

module.exports = function(member) {
    const socials = "**Twitch:** https://www.twitch.tv/lilpotate/\n"
                  + "**Twitter:** https://twitter.com/thelilpotate\n"
                  + "**Instagram:** https://www.instagram.com/thelilpotate/\n"
                  + "**Youtube:** https://www.youtube.com/channel/UCfJWGBY3b-o74Ko8DTidEQg";

    const wellcomeMsg = `Welcome to **${member.guild.name}** discord server!`
                      + "We’re happy to have you here."
                      + "To stay up to date on when lilPotate will go live, follow her on her socials!";
                      
    const eWellcome = new Discord.RichEmbed()
                    .setColor("RANDOM")
                    .setTitle("**HI** <:lilpotHypebot:642086734774927363>")
                    .setDescription(wellcomeMsg)
                    .addField("**SOCIALS**", socials);

    member.user.send(eWellcome);
    return member.addRole(global.gConfig.discord.default_role);
};