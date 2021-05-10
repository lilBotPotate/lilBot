import { Collection, databaseHandler } from '../../database/database';
import { logger } from '../../utils/logger';

export type DbConfig<T extends keyof Configs> = { _id: T; value: Configs[T] };

export type Configs = {
    birthday_channel: string | null;
    admin_roles: string[];
    emojis: {
        loading: string | null;
    };
};

const defaultConfig: Configs = {
    birthday_channel: null,
    admin_roles: [],
    emojis: {
        loading: null
    }
};

export class ConfigHandler {
    private collection: Collection;

    constructor(collection: Collection) {
        this.collection = collection;
    }

    public async get<T extends keyof Configs>(_id: T): Promise<Configs[T] | null> {
        const config = await databaseHandler.getOne<DbConfig<T>, any>(this.collection, { _id });
        if (!config) {
            const output = await databaseHandler.insertOne<DbConfig<T>, DbConfig<T>>(this.collection, {
                _id,
                value: defaultConfig[_id]
            });

            if (output.result.ok === 1) return output.ops[0].value;
            else {
                logger.error(`Failed to add config "${_id}"`);
                return null;
            }
        }

        return config.value;
    }

    public async set<T extends keyof Configs>(_id: T, value: Configs[T]): Promise<Configs[T] | null> {
        const config = await databaseHandler.updateOne<{ _id: any }, { value: Configs[T] }>(
            this.collection,
            { _id },
            { value }
        );

        if (config.result.ok !== 1) {
            logger.error(`Failed to set config "${_id}"`);
            return null;
        }

        return value;
    }
}
