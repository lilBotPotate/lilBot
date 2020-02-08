const {
    Discord,
    Canvas,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("DAB")
      .setInfo("One dab a day keeps the doctor away")
      .addUse("dab", "lilPotate dabbs on you")
      .addUse("dab {tag}", "lilPotate dabbs on tagged user")
      .setCommand(sendDabImage);

async function sendDabImage(msg) {
    const user = msg.mentions.users.first() ? msg.mentions.users.first() : msg.author;

    const potateDab = await Canvas.loadImage("../../../../files/images/dab.png");
    const avatarImage = await Canvas.loadImage(user.displayAvatarURL);

    const canvas = Canvas.createCanvas(avatarImage.width, avatarImage.height);
    const ctx = canvas.getContext("2d");

    const potSize = avatarImage.height / 3;
    
    ctx.drawImage(avatarImage, 0, 0);
    ctx.drawImage(
        potateDab, 
        10, 
        2 * potSize,
        (potSize / potateDab.height) * potateDab.width,
        potSize
    );

    const dabImage = new Discord.Attachment(canvas.toBuffer(), "dabImage.png");
    const eDab = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle(`**Oh oh... lilPotate dabbed on ${user.username}!**`)
          .setImage("attachment://dabImage.png");
    return await msg.channel.send({ files: [dabImage], embed: eDab });
}