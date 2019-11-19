const {
    Discord
} = require("../../Imports.js");

module.exports = function(member) {
    const socials = "**Twitch:** https://www.twitch.tv/lilpotate/"
                  + "\n**Twitter:** https://twitter.com/thelilpotate"
                  + "\n**Instagram:** https://www.instagram.com/thelilpotate/"
                  + "\n**Youtube:** https://www.youtube.com/channel/UCfJWGBY3b-o74Ko8DTidEQg";

    const eWellcome = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("**HI** <:lilpotHypebot:642086734774927363>")
        .setDescription(`Welcome to **${member.guild.name}** discord server! We’re happy to have you here. To stay up to date on when lilPotate will go live, follow her on her socials!`)
        .addField("**SOCIALS**", socials);

    member.user.send(eWellcome);
    member.addRole(global.gConfig.def_role);
};