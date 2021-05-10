import { discordClient } from '../bots/discord/botDiscord';
import { logger } from '../utils/logger';
import Discord from 'discord.js';
import { UsersDb } from '../database/database';
import { User } from '../database/objects/User';
import { discordBirthdayMessage } from '../utils/discord';

export function midnightSchedule() {
    logger.info('Executing midnight schedule');
    
    // TODO: Dynamic channel
    const channel = discordClient.channels.cache.get('642844658698813440') as Discord.TextChannel | undefined;

    if (!channel) return logger.error('Failed to fetch Discord birthday channel');

    const date = new Date();
    UsersDb.getByParams<User>({
        birthday: { $ne: null },
        'birthday.day': date.getDate(),
        'birthday.month': date.getMonth() + 1
    }).then((users = []) => {
        users.forEach((user) => channel?.send(discordBirthdayMessage(user._id)));
    });
}
