import Discord from 'discord.js';
import { formatCount } from '../../../utils/general';
import { logger } from '../../../utils/logger';

export default function (this: Discord.Client) {
    const botUser: string = `${this.user?.username}#${this.user?.discriminator}`;
    const guilds = formatCount('guild', this.guilds.cache.size);
    const channels = formatCount('channel', this.channels.cache.size);
    const users = formatCount('user', this.users.cache.size);

    logger.info(`Logged in as "${botUser}" (${guilds}, ${channels}, ${users})`);
}