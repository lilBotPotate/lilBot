import Discord from 'discord.js';
import fs from 'fs';
import { DiscordBotCommandProps } from '../configDiscord';
import { fork } from 'child_process';
import { GifRaceProps } from '../../../workers/gif-race/GifRace';
import { GifRaceUser } from '../../../workers/gif-race/GifRaceUser';
import { DiscordEmbed } from '../../../utils/discord';
import { logger } from '../../../utils/logger';
import { ConfigDb } from '../../../database/database';

export default async function ({ msg, args }: DiscordBotCommandProps) {
    if (!msg.guild) return;
    const mentions = msg.mentions.members || new Discord.Collection<'string', Discord.GuildMember>();

    msg.mentions.roles.each((role) => {
        role.members.forEach((member) => mentions.set(member.id, member));
    });

    let maxUsers = 25;

    const options: any = {};
    switch (args[0]?.toUpperCase()) {
        case 'LONG':
            options.width = 25;
            maxUsers = 15;
            break;
        case 'SHORT':
            options.width = 9;
            maxUsers = 35;
            break;
        default:
            break;
    }

    if (mentions.size < 2) return msg.reply('Minimum amount of users is 2!');
    if (mentions.size > maxUsers) return msg.reply(`Maximum amount of users is ${maxUsers}!`);

    const data: Omit<GifRaceProps, 'onResults'> = {
        users: mentions.array().map((member) => ({
            id: member.id,
            avatarUrl: member.user.displayAvatarURL({ format: 'png', size: 32 }),
            color: member.displayHexColor === '#000000' ? '#dddddd' : member.displayHexColor
        }))
    };

    const emojis = await ConfigDb.get('emojis');

    msg.channel
        .send(
            `${emojis?.loading || 'Loading'} ${data.users
                .map((user, i) => {
                    if (i == data.users.length - 2) {
                        return `<@${user.id}>`;
                    } else if (i >= data.users.length - 1) {
                        return `and <@${user.id}>`;
                    } else {
                        return `<@${user.id}>,`;
                    }
                })
                .join(' ')} are racing`
        )
        .then((message) => {
            const worker = fork('./src/workers/gif-race/workerGifRace', {
                detached: true
            });

            worker?.send({ type: 'start', data });
            worker.on('message', ({ type, data }: { type: 'results'; data: any }) => {
                switch (type) {
                    case 'results': {
                        return onResults(message, data);
                    }
                    default: {
                        return;
                    }
                }
            });
        });
}

function onResults(msg: Discord.Message, data: { users: GifRaceUser[]; path?: string | Buffer }) {
    if (!data.path) return msg.channel.send('Error: No file path');

    msg.channel
        .send({
            files: [
                {
                    attachment: data.path,
                    name: 'gifGame.gif'
                }
            ],
            ...DiscordEmbed({
                title: 'Race',
                description:
                    data.users
                        .map((user, i) => {
                            if (!user.done || !user.finish) return `**DNF** <@${user.user.id}>`;
                            return `**${i + 1}.** <@${user.user.id}> \`${
                                Math.round(user.finish.time * 0.2) / 10
                            }s\``;
                        })
                        .join('\n') || 'Error',
                image: {
                    url: 'attachment://gifGame.gif'
                }
            })
        })
        .then(deleteFile)
        .catch(() => {
            msg.channel.send('Failed to create results. Please contact the administrator.');
            deleteFile();
        });

    function deleteFile() {
        msg.delete();
        if (!data.path) return logger.error('Failed to delete file: Missing path');
        try {
            fs.unlinkSync(data.path);
        } catch (err) {
            logger.error(`Failed to delete "${data.path}"`);
        }
    }
}
