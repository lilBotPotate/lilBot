import { UsersDb } from '../../database/database';
import { User, UserObject } from '../../database/objects/User';
import { logger } from '../../utils/logger';

export async function createUser(id: any): Promise<User | undefined> {
    logger.debug("createUser")
    const output = await UsersDb.add<User, User>(new UserObject(id).toJson());
    if (output.result.ok === 1 && output.ops.length > 0) return output.ops[0];
    return;
}

export async function getOrCreateUser(id: any): Promise<User | undefined> {
    const user = await UsersDb.getById<User>(id);
    if (user) return user;
    return createUser(id);
}