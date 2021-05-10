import Discord from 'discord.js';
import birthdayWishes from '../files/json/birthdayWishes.json';
import { brandColors, randomArrayElement } from './general';

export const baseEmbed = {
    color: brandColors.DISCORD
};

export function DiscordEmbed(options: Discord.MessageEmbedOptions) {
    return {
        embed: {
            ...baseEmbed,
            ...options
        }
    };
}

export function discordMSGR(msg: Discord.Message, message: string) {
    return msg.channel.send(
        DiscordEmbed({
            description: `${msg.author.toString()}, ${message}`
        })
    );
}

export function discordBirthdayMessage(id: string): string {
    return `<@${id}> *${randomArrayElement(birthdayWishes)}*`;
}
