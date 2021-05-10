import Discord from 'discord.js';
import exampleCanvas from '../canvas/exampleCanvas';
import { DiscordBotCommandProps } from '../configDiscord';

export default function ({ msg }: DiscordBotCommandProps) {
    return msg.channel.send(exampleCanvas());
}
