import Discord from 'discord.js';
import SteamID from 'steamid';
import { DiscordBotCommandProps } from '../configDiscord';
import { RequestsDb } from '../../../database/database';
import { DiscordEmbed, discordMSGR } from '../../../utils/discord';
import { Request, RequestObject } from '../../../database/objects/Request';
import { logger } from '../../../utils/logger';
import { brandColors } from '../../../utils/general';

export default async function ({ msg }: DiscordBotCommandProps) {
    return msg.channel.send(
        DiscordEmbed({
            title: 'Account Bind',
            description: 'This is a required feature for integration between different platforms.',
            fields: [
                {
                    name: 'Twitch',
                    value: `Type \`${process.env.PREFIX}bind twitch <username>\` to bind your Twitch account.`
                },
                {
                    name: 'Steam',
                    value: `Type \`${process.env.PREFIX}bind steam <id>\` to bind your Steam account.`
                }
            ]
        })
    );
}

export async function bindTwitch({ msg, args }: DiscordBotCommandProps) {
    const accountId = args.shift();
    if (!accountId) return discordMSGR(msg, 'Please input your twitch username.');

    const deleteOutput = await RequestsDb.deleteByParams<Partial<Request>>({
        user_id: msg.author.id,
        type: 'twitch_bind'
    });

    if (deleteOutput.result.ok !== 1) {
        logger.error(`Failed to remove "twitch_bind" requests from ${msg.author.id}`);
    }

    const request = await RequestsDb.add<Request, Omit<Request, '_id'>>(
        new RequestObject('twitch_bind', msg.author.id, accountId).toJson()
    );

    if (request.result.ok !== 1) {
        return discordMSGR(msg, 'failed to create a request... Please contact the administrator.');
    }

    const chatUrl = `https://www.twitch.tv/${process.env.TWITCH_BOT_USERNAME}/chat`;
    return msg.author
        .send(
            DiscordEmbed({
                color: brandColors.TWITCH,
                title: 'Bind Twitch account',
                description: `Please visit ${chatUrl} and post the following command in the chat to bind account \`${accountId}\` to you.`,
                fields: [
                    {
                        name: 'Command',
                        value: '```' + '!bind ' + request.ops[0]._id + '```'
                    }
                ]
            })
        )
        .catch(() =>
            discordMSGR(msg, 'failed to send you a DM... Please enable it or contact the administrator.')
        );
}

export async function bindSteam({ msg, args }: DiscordBotCommandProps) {
    const accountId = args.shift();
    if (!accountId) return discordMSGR(msg, 'Please input your Steam ID.');

    let steamId: SteamID | undefined;
    try {
        steamId = new SteamID(accountId);
    } catch (error) {
        return discordMSGR(msg, 'Please input a valid Steam ID.');
    }
    if (!steamId || !steamId?.isValid()) return discordMSGR(msg, 'Please input a valid Steam ID.');

    const deleteOutput = await RequestsDb.deleteByParams<Partial<Request>>({
        user_id: msg.author.id,
        type: 'steam_bind'
    });

    if (deleteOutput.result.ok !== 1) {
        logger.error(`Failed to remove "steam_bind" requests from ${msg.author.id}`);
    }

    const request = await RequestsDb.add<Request, Omit<Request, '_id'>>(
        new RequestObject('steam_bind', msg.author.id, steamId.getSteamID64()).toJson()
    );

    if (request.result.ok !== 1) {
        return discordMSGR(msg, 'failed to create a request... Please contact the administrator.');
    }

    const chatUrl = `Chat url`;
    return msg.author
        .send(
            DiscordEmbed({
                color: brandColors.STEAM,
                title: 'Bind Steam account',
                description: `Please visit ${chatUrl} and post the following command in the chat to bind account \`${accountId}\` to you.`,
                fields: [
                    {
                        name: 'Command',
                        value: '```' + '!bind ' + request.ops[0]._id + '```'
                    }
                ]
            })
        )
        .catch(() =>
            discordMSGR(msg, 'failed to send you a DM... Please enable it or contact the administrator.')
        );
}
