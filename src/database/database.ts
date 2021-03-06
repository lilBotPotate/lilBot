import mongodb from 'mongodb';
import assert from 'assert';
import { logger } from '../utils/logger';
import { DatabaseHandler } from '../handlers/database/DatabaseHandler';
import { CollectionHandler } from '../handlers/database/CollectionHandler';
import { ConfigHandler } from '../handlers/database/ConfigHandler';

export let databaseHandler: DatabaseHandler;

export enum Collection {
    USERS = 'users',
    CUSTOM_COMMANDS = 'custom_commands',
    REQUESTS = 'requests',
    CONFIG = 'config'
}

// Collection Handlers
export const UsersDb = new CollectionHandler(Collection.USERS);
export const CustomCommandsDb = new CollectionHandler(Collection.CUSTOM_COMMANDS);
export const RequestsDb = new CollectionHandler(Collection.REQUESTS);

// Config Handler
export const ConfigDb = new ConfigHandler(Collection.CONFIG);

// Init
export async function createDatabaseClient(): Promise<DatabaseHandler | undefined> {
    return new Promise((resolve, reject) => {
        if (!process.env.MONGODB_URL || !process.env.DB_NAME) return reject();

        const client = new mongodb.MongoClient(process.env.MONGODB_URL, { useUnifiedTopology: true });
        client.connect((error, result) => {
            assert.strictEqual(null, error);
            logger.info('Successfully connected to the MongoDb database');
            databaseHandler = new DatabaseHandler(result, process.env.DB_NAME || '');
            resolve(databaseHandler);
        });
    });
}
