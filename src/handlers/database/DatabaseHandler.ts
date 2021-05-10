import mongodb from 'mongodb';
import { logger } from '../../utils/logger';

export type CursorCallback = <T>(cursor: mongodb.Cursor<T>) => mongodb.Cursor<T>;

export class DatabaseHandler {
    private client: mongodb.MongoClient;
    private db: mongodb.Db;

    constructor(client: mongodb.MongoClient, database: string) {
        this.client = client;
        this.db = client.db(database);
        logger.database(`New DatabaseHandler for "${database}"`);
    }

    public getClient(): mongodb.MongoClient {
        return this.client;
    }

    public getDatabase(): mongodb.Db {
        return this.db;
    }

    public async insertOne<T extends { _id: any }, S>(
        collection: string,
        data: S
    ): Promise<mongodb.InsertOneWriteOpResult<T>> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).insertOne(data, (error, result) => {
                if (error) {
                    logger.error(`Failed to insert one to "${collection}" `, error);
                    return reject(error);
                }
                logger.database(`Inserted one to "${collection}"`);
                return resolve(result);
            });
        });
    }

    public async insertMany<T extends { _id: any }, S>(
        collection: string,
        data: S[]
    ): Promise<mongodb.InsertWriteOpResult<T>> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).insertMany(data, (error, result) => {
                if (error) {
                    logger.error(`Failed to insert many to "${collection}" `, error);
                    return reject(error);
                }
                logger.database(`Inserted many to "${collection}"`);
                return resolve(result);
            });
        });
    }

    public async getOne<T extends { _id: any }, S>(
        collection: string,
        filter: mongodb.FilterQuery<S>
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOne(filter, (error, result) => {
                if (error) {
                    logger.error(`Failed to get one from "${collection}" `, error);
                    return reject(error);
                }
                logger.database(`Got one from "${collection}" `, filter);
                return resolve(result);
            });
        });
    }

    public async getMany<T extends { _id: any }, S>(
        collection: string,
        filter: mongodb.FilterQuery<S>,
        callback?: CursorCallback
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            let cursor = this.db.collection(collection).find(filter);
            if (callback) cursor = callback(cursor);
            cursor.toArray((error, result) => {
                if (error) {
                    logger.error(
                        `Failed to get many from "${collection}" ${callback ? '(CUSTOM) ' : ''}`,
                        error
                    );
                    return reject(error);
                }
                logger.database(`Got many from "${collection}" ${callback ? '(CUSTOM) ' : ''}`, filter);
                return resolve(result);
            });
        });
    }

    public async updateOne<T extends { _id: any }, S>(
        collection: string,
        filter: mongodb.FilterQuery<T>,
        data: S
    ): Promise<mongodb.UpdateWriteOpResult> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).updateOne(filter, { $set: data }, (error, result) => {
                if (error) {
                    logger.error(`Failed to update one in "${collection}" `, error);
                    return reject(error);
                }
                logger.database(`Updated one in "${collection}" `, filter);
                return resolve(result);
            });
        });
    }

    public async updateMany<T, S>(
        collection: string,
        filter: mongodb.FilterQuery<T>,
        data: S
    ): Promise<mongodb.UpdateWriteOpResult> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).updateMany(filter, { $set: data }, (error, result) => {
                if (error) {
                    logger.error(`Failed to update many in "${collection}" `, error);
                    return reject(error);
                }
                logger.database(`Updated many in "${collection}" `, filter);
                return resolve(result);
            });
        });
    }

    public async deleteOne<T>(
        collection: string,
        filter: mongodb.FilterQuery<T>
    ): Promise<mongodb.DeleteWriteOpResultObject> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).deleteOne(filter, (error, result) => {
                if (error) {
                    logger.error(`Failed to delete one in "${collection}" `, error);
                    return reject(error);
                }
                logger.database(`Deleted one in "${collection}" `, filter);
                return resolve(result);
            });
        });
    }

    public async deleteMany<T>(
        collection: string,
        filter: mongodb.FilterQuery<T>
    ): Promise<mongodb.DeleteWriteOpResultObject> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).deleteMany(filter, (error, result) => {
                if (error) {
                    logger.error(`Failed to delete many in "${collection}" `, error);
                    return reject(error);
                }
                logger.database(`Deleted many in "${collection}" `, filter);
                return resolve(result);
            });
        });
    }
}
