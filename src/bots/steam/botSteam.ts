import SteamUser from 'steam-user';
import { logger } from '../../utils/logger';
import { steamChatEvents, steamEvents } from './configSteam';

export let steamClient: any;

export async function createSteamClient(): Promise<any> {
    logger.info('Creating Steam Client');
    const client = new SteamUser();

    logger.info('Steam client connect');
    client.logOn({
        accountName: process.env.STEAM_USERNAME,
        password: process.env.STEAM_PASSWORD
    });

    addEvents(client);

    steamClient = client;
    return client;
}

function addEvents(client: any) {
    for (const event of steamEvents) {
        client.on(event.type, (...args: any) => event.function(client, ...args));
        logger.info(`Added steam event "${event.type}"`);
    }

    for (const event of steamChatEvents) {
        client.chat.on(event.type, (...args: any) => event.function(client, ...args));
        logger.info(`Added steam chat event "${event.type}"`);
    }
}
