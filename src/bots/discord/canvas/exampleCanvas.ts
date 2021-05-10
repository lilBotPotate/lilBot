import Discord from 'discord.js';
import Canvas from 'canvas';

export default function (): Discord.MessageAttachment {
    const canvas = Canvas.createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.font = '30px Impact';
    ctx.fillText('Example!', 30, 100);

    return new Discord.MessageAttachment(canvas.toBuffer(), 'example.png');
}
