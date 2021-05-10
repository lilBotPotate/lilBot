import { discordClient } from '../bots/discord/botDiscord';
import { logger } from '../utils/logger';
import Discord from 'discord.js';
import { ConfigDb, UsersDb } from '../database/database';
import { User } from '../database/objects/User';
import { discordBirthdayMessage } from '../utils/discord';

export async function midnightSchedule() {
    logger.info('Executing midnight schedule');

    const birthdayChannel = await ConfigDb.get('birthday_channel');
    if (!birthdayChannel) return logger.warn('Birthday channel is not defined');
    const channel = discordClient.channels.cache.get(birthdayChannel) as Discord.TextChannel | undefined;

    if (!channel) return logger.error('Failed to fetch Discord birthday channel');

    const date = new Date();
    return UsersDb.getByParams<User>({
        birthday: { $ne: null },
        'birthday.day': date.getDate(),
        'birthday.month': date.getMonth() + 1
    }).then((users = []) => {
        users.forEach((user) => channel?.send(discordBirthdayMessage(user._id)));
    });
}
