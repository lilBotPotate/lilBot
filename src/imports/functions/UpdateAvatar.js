const {
    Universal,
    Canvas
} = require("../Imports");

module.exports = async function() {
    const avatarImage = await Canvas.loadImage("./src/files/avatars/lilBot-avatar.png");

    const canvas = Canvas.createCanvas(avatarImage.width, avatarImage.height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = Universal.randomHexColor();

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatarImage, 0, 0);

    return global.gClientDiscord.user.setAvatar(canvas.toBuffer())    
           .then((user) => Universal.sendLog("info", "Updated Discord Bots avatar " + ctx.fillStyle))
           .catch((error) => Universal.sendLog("error", `Failed to update Discord Bots avatar:\n${error}`));
};