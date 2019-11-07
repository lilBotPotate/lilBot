const { def_role } = require("../../../config.json");

module.exports = function(member) {
    const message = "**HI** :lilpotHype:"
                  + `\nWelcome to **${member.guild.name}** discord server! We’re happy to have you here. To stay up to date on when lilPotate will go live, follow her on her socials:`
                  + "\n> **Twitch:** https://www.twitch.tv/lilpotate/"
                  + "\n> **Twitter:** https://twitter.com/thelilpotate"
                  + "\n> **Instagram:** https://www.instagram.com/thelilpotate/"
                  + "\n> **Youtube:** https://www.youtube.com/channel/UCfJWGBY3b-o74Ko8DTidEQg";

    member.user.send(message);
    member.addRole(def_role);
};