import tmi from 'tmi.js';
import { TwitchBotCommand, TwitchBotCommands, twitchCommands as defaultCommands } from '../../bots/twitch/configTwitch';
import { logger } from '../../utils/logger';

export function isTwitchCommand(message: string): boolean {
    if (!process.env.PREFIX) return false;
    return message.startsWith(process.env.PREFIX);
}

export function executeTwitchCommand(
    client: tmi.Client,
    channel: string,
    tags: tmi.ChatUserstate,
    message: string
) {
    if (!process.env.PREFIX) return logger.error('Missing "PREFIX" environment variable');

    const args: string[] = message.slice(process.env.PREFIX.length).split(/ +/) || [];

    let commands: TwitchBotCommands = defaultCommands;
    let command: TwitchBotCommand | undefined;
    let index: number = 0;

    for (let i = 0; i < args.length; i++) {
        const id = args[i].toUpperCase();
        if (!commands[id]) break;

        command = commands[id];
        index = i + 1;

        if (!command.subCommands) break;
        commands = command.subCommands;
    }

    if (!command) return;
    const cmdArgs = args.splice(index);

    logger.command(
        `TWITCH ${tags.username} executed ${args.join(' > ').toUpperCase()} [${cmdArgs.join(
            ', '
        )}] in ${channel}`
    );

    return command.function({ client, channel, tags, message, args: cmdArgs });
}
