import tmi from 'tmi.js';
import { logger } from '../../utils/logger';
import { twitchEvents } from './configTwitch';

// https://dev.twitch.tv/docs/irc/tags
export let twitchClient: tmi.Client;

export async function createTwitchClient(): Promise<tmi.Client> {
    logger.info('Creating Twitch Client');
    const client = new tmi.Client({
        options: { debug: true },
        connection: { reconnect: true },
        identity: {
            username: process.env.TWITCH_BOT_USERNAME,
            password: `oauth:${process.env.TWITCH_BOT_TOKEN}`
        },
        channels: process.env.TWITCH_BOT_CHANNELS?.split(' ') || [],
        logger: {
            info: logger.tmi.info,
            warn: logger.tmi.warn,
            error: logger.tmi.error
        }
    });

    logger.info('Twitch client connect');
    await client.connect();

    // Todo: handle on connect, etc
    addEvents(client);

    twitchClient = client;
    return client;
}

function addEvents(client: tmi.Client) {
    for (const event of twitchEvents) {
        client.on(event.type, event.function);
        logger.info(`Added twitch event "${event.type}"`);
    }
}
