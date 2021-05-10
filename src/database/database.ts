import mongodb from 'mongodb';
import assert from 'assert';
import { logger } from '../utils/logger';
import { DatabaseHandler } from '../handlers/database/DatabaseHandler';
import { CollectionHandler } from '../handlers/database/CollectionHandler';
import { Configs, defaultConfigs } from './objects/Configs';

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
export const ConfigDb = new CollectionHandler(Collection.CONFIG);

// Init
export async function createDatabaseClient(): Promise<DatabaseHandler | undefined> {
    return new Promise((resolve, reject) => {
        if (!process.env.MONGODB_URL || !process.env.DB_NAME) return reject();

        const client = new mongodb.MongoClient(process.env.MONGODB_URL, { useUnifiedTopology: true });
        client.connect((error, result) => {
            assert.strictEqual(null, error);
            logger.info('Successfully connected to the MongoDb database');
            databaseHandler = new DatabaseHandler(result, process.env.DB_NAME || '');
            addDefaultConfig();
            resolve(databaseHandler);
        });
    });
}

async function addDefaultConfig() {
    // const collection = databaseHandler.getDatabase().collection(Collection.CONFIG);

    // return Promise.all(
    //     Object.keys(defaultConfigs).map(async (key) => {
    //         await collection.updateOne(
    //             {
    //                 _id: key
    //             },
    //             { $set: { value: (defaultConfigs as any)[key] } },
    //             { upsert: true }
    //         );
    //     })
    // );
}
