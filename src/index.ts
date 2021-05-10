import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { createDatabaseClient } from './database/database';
import { startBots } from './bots/bots';
import { createSchedules } from './schedules/shedules';
// import { gifGame } from './bots/discord/gif/GifRace';

const output = dotenv.config();

(async () => {
    if (output.error) return logger.error(output.error);
    if (!output.parsed) return logger.error('Failedto load environment variables');
    logger.info('Loaded environment variables');
    checkEnv();

    // gifGame();

    await createDatabaseClient();
    await startBots();

    // return createSchedules();
})();

function checkEnv() {
    const environmentVariables = [
        'PREFIX',
        'BOT_TOKEN',
        'TWITCH_BOT_TOKEN',
        'TWITCH_BOT_USERNAME',
        'TWITCH_BOT_CHANNELS',
        'MONGODB_URL',
        'DB_NAME',
        'STEAM_USERNAME',
        'STEAM_PASSWORD',
        'STEAM_CHAT_ID'
    ];

    for (const env of environmentVariables) {
        if (!process.env[env]) logger.fatal(`Missing environment variable "${env}"`);
    }
}
