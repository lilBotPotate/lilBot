const {
    Discord,
    Canvas
} = require("../../../Imports.js");

module.exports = {
    name: "DAB",
    description: {
        "info": "One dab a day keeps the doctor away",
        "uses": {
            "dab": "lilPotate dabbs on you",
            "dab {tag}": "lilPotate dabbs on tagged user"
        }
    },
    execute(msg, args) {
        return createImage(msg);
    }
};

async function createImage(msg) {
    const user = msg.mentions.users.first() ? msg.mentions.users.first() : msg.author;

    const potateDab = await Canvas.loadImage("./files/dab.png");
    const avatarImage = await Canvas.loadImage(user.displayAvatarURL);

    const canvas = Canvas.createCanvas(avatarImage.width, avatarImage.height);
    const ctx = canvas.getContext("2d");

    await ctx.drawImage(avatarImage, 0, 0);

    const potSize = avatarImage.height / 3;

    await ctx.drawImage(
        potateDab, 
        10, 
        2 * potSize,
        (potSize / potateDab.height) * potateDab.width,
        potSize
    );

    const dabImage = await new Discord.Attachment(canvas.toBuffer(), "dabImage.png");
    
    const eDab = await new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**Oh oh... lilPotate dabbed on ${user.username}!**`)
        .setImage("attachment://dabImage.png");

    await msg.channel.send({ files: [dabImage], embed: eDab });
}