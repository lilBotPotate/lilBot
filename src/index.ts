import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { createDatabaseClient } from './database/database';
import { startBots } from './bots/bots';
import { createSchedules } from './schedules/shedules';

const output = dotenv.config();

(async () => {
    if (output.error) return logger.error(output.error);
    if (!output.parsed) return logger.error('Failedto load environment variables');
    logger.info('Loaded environment variables');
    checkEnv();

    await createDatabaseClient();
    await startBots();

    // return createSchedules();
})();

function checkEnv() {
    const environmentVariables = [
        // General config
        'PREFIX',
        // Discord bot config
        'BOT_TOKEN',
        // Twitch bot config
        'TWITCH_BOT_TOKEN',
        'TWITCH_BOT_USERNAME',
        'TWITCH_BOT_CHANNELS',
        // Steam bot config
        'STEAM_USERNAME',
        'STEAM_PASSWORD',
        'STEAM_CHAT_ID',
        // Mongodb config
        'MONGODB_URL',
        'DB_NAME'
    ];

    for (const env of environmentVariables) {
        if (!process.env[env]) logger.fatal(`Missing environment variable "${env}"`);
    }
}
