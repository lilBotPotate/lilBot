import Discord from 'discord.js';
import { logger } from '../../utils/logger';
import { discordEvents } from './configDiscord';

export let discordClient: Discord.Client;

export async function createDiscordClient(): Promise<Discord.Client> {
    logger.info('Creating Discord Client');
    const client = new Discord.Client();

    logger.info('Discord client login');
    await client.login(process.env.BOT_TOKEN);

    addEvents(client);

    discordClient = client;
    return client;
}

function addEvents(client: Discord.Client) {
    for (const event of discordEvents) {
        client.on(event.type, event.function);
        logger.info(`Added discord event "${event.type}"`);
    }
}