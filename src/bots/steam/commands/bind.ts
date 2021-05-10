import { ObjectId } from 'mongodb';
import { RequestsDb, UsersDb } from '../../../database/database';
import { steamMSGR } from '../../../utils/steam';
import { SteamBotCommandProps } from '../configSteam';
import { Request } from '../../../database/objects/Request';
import { logger } from '../../../utils/logger';
import { getOrCreateUser } from '../../../handlers/user/UserHandlers';
import { discordClient } from '../../discord/botDiscord';
import { DiscordEmbed } from '../../../utils/discord';
import { brandColors } from '../../../utils/general';

export default async function ({ client, msg, args }: SteamBotCommandProps) {
    const requestId = args.shift();
    if (!requestId) return steamMSGR(client.chat, msg, 'please input the code.');
    if (!ObjectId.isValid(requestId)) {
        return steamMSGR(client.chat, msg, "that request doesn't exist.");
    }

    const request = await RequestsDb.getById<Request>(new ObjectId(requestId));
    if (!request) return steamMSGR(client.chat, msg, "that request doesn't exist.");
    if (request.type.localeCompare('steam_bind')) {
        return steamMSGR(client.chat, msg, 'that request is not valid.');
    }

    const steamId = msg.steamid_sender.getSteamID64();
    if (
        request.account_id.localeCompare(steamId, undefined, {
            sensitivity: 'accent'
        })
    ) {
        return steamMSGR(client.chat, msg, 'that request is for a different account.');
    }

    const deleteOutput = await RequestsDb.deleteById(request._id);
    if (deleteOutput.result.ok !== 1) logger.error(`Failed to delete request "${request._id}"`);

    const user = await getOrCreateUser(request.user_id);
    if (!user) {
        return steamMSGR(client.chat, msg, "user doesn't exist. Please contact the administrator.");
    }

    const userOutput = await UsersDb.updateById(request.user_id, {
        platforms: {
            ...user.platforms,
            steam: {
                id: steamId
            }
        }
    });

    if (userOutput.result.ok == 1) {
        logger.info(`Binded Steam account "${steamId}" with "${request.user_id}"`);

        const discordUser = discordClient.users.cache.find((u) => u.id === request.user_id);
        if (discordUser) {
            discordUser.send(
                DiscordEmbed({
                    color: brandColors.STEAM,
                    title: 'Steam account added',
                    description: `Saved account \`${steamId}\` as your Steam account.`
                })
            );
        } else {
            logger.error(`Failed to fetch discord user "${request.user_id}"`);
        }
        return steamMSGR(client.chat, msg, 'saved!');
    }

    logger.error(`Failed to bind Steam account "${steamId}" with "${request.user_id}"`);
    return steamMSGR(client.chat, msg, 'failed to save. Please contact the administrator.');
}
