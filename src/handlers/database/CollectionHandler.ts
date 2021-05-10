import { Collection, databaseHandler } from '../../database/database';
import { logger } from '../../utils/logger';
import { CursorCallback } from './DatabaseHandler';

export class CollectionHandler {
    private collection: Collection;

    constructor(collection: Collection) {
        this.collection = collection;
        logger.database(`New CollectionHandler for collection "${collection}"`);
    }

    public async add<T extends { _id: any }, S>(data: S | S[]) {
        if (Array.isArray(data)) return databaseHandler.insertMany<T, S>(this.collection, data);
        return databaseHandler.insertOne<T, S>(this.collection, data);
    }

    public async getById<T extends { _id: any }>(_id: any) {
        return databaseHandler.getOne<T, any>(this.collection, { _id });
    }

    public async getByParams<T extends { _id: any }>(params: any, callback?: CursorCallback) {
        return databaseHandler.getMany<T, any>(this.collection, params, callback);
    }

    public async getAll<T extends { _id: any }>(callback?: CursorCallback) {
        return databaseHandler.getMany<T, {}>(this.collection, {}, callback);
    }

    public async updateById<S>(_id: any, data: S) {
        return databaseHandler.updateOne<{ _id: any }, S>(this.collection, { _id }, data);
    }

    public async updateByParams<S>(params: any, data: S) {
        return databaseHandler.updateMany<any, S>(this.collection, params, data);
    }

    public async deleteById(_id: any) {
        return databaseHandler.deleteOne<{ _id: any }>(this.collection, { _id });
    }

    public async deleteByParams<T>(params: T) {
        return databaseHandler.deleteMany<T>(this.collection, params);
    }
}
