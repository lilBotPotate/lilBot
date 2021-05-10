import { discordClient } from '../../discord/botDiscord';
import { RequestsDb, UsersDb } from '../../../database/database';
import { logger } from '../../../utils/logger';
import { TwitchBotCommandProps } from '../configTwitch';
import { Request } from '../../../database/objects/Request';
import { ObjectId } from 'mongodb';
import { getOrCreateUser } from '../../../handlers/user/UserHandlers';
import { DiscordEmbed } from '../../../utils/discord';
import { brandColors } from '../../../utils/general';
import { twitchMSGR } from '../../../utils/twitch';

export default async function ({ client, channel, tags, args }: TwitchBotCommandProps) {
    if (!tags.username || !tags['user-id']) {
        return twitchMSGR(client, channel, tags, 'this is not a valid account.');
    }

    const requestId = args.shift();
    if (!requestId) return twitchMSGR(client, channel, tags, 'please input the code.');
    if (!ObjectId.isValid(requestId)) {
        return twitchMSGR(client, channel, tags, "that request doesn't exist.");
    }

    const request = await RequestsDb.getById<Request>(new ObjectId(requestId));
    if (!request) return twitchMSGR(client, channel, tags, "that request doesn't exist.");
    if (request.type.localeCompare('twitch_bind')) {
        return twitchMSGR(client, channel, tags, 'that request is not valid.');
    }
    if (request.account_id.localeCompare(tags.username, undefined, { sensitivity: 'accent' })) {
        return twitchMSGR(client, channel, tags, 'that request is for a different account.');
    }

    const deleteOutput = await RequestsDb.deleteById(request._id);
    if (deleteOutput.result.ok !== 1) logger.error(`Failed to delete request "${request._id}"`);

    const user = await getOrCreateUser(request.user_id);
    if (!user) {
        return twitchMSGR(client, channel, tags, "user doesn't exist. Please contact the administrator.");
    }

    const userOutput = await UsersDb.updateById(request.user_id, {
        platforms: {
            ...user.platforms,
            twitch: {
                username: tags.username,
                id: tags['user-id']
            }
        }
    });

    if (userOutput.result.ok == 1) {
        logger.info(`Binded Twitch account "${tags.username}" with "${request.user_id}"`);

        const discordUser = discordClient.users.cache.find((u) => u.id === request.user_id);
        if (discordUser) {
            discordUser.send(
                DiscordEmbed({
                    color: brandColors.TWITCH,
                    title: 'Twitch account added',
                    description: `Saved account \`${tags.username}\` as your Twitch account.`
                })
            );
        } else {
            logger.error(`Failed to fetch discord user "${request.user_id}"`);
        }
        return twitchMSGR(client, channel, tags, 'saved!');
    }

    logger.error(`Failed to bind Twitch account "${tags.username}" with "${request.user_id}"`);
    return twitchMSGR(client, channel, tags, 'failed to save. Please contact the administrator.');
}
