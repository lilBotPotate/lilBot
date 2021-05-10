import { SteamBotCommand, SteamBotCommands, steamCommands } from '../../bots/steam/configSteam';
import { SteamChatMessage } from '../../bots/steam/events/onChatMessage';
import { logger } from '../../utils/logger';

export function isSteamCommand(message: string): boolean {
    if (!process.env.PREFIX) return false;
    return message.startsWith(process.env.PREFIX);
}

export function executeSteamCommand(client: any, msg: SteamChatMessage) {
    if (!process.env.PREFIX) return logger.error('Missing "PREFIX" environment variable');

    const args: string[] = msg.message.slice(process.env.PREFIX.length).split(/ +/) || [];

    let commands: SteamBotCommands = steamCommands;
    let command: SteamBotCommand | undefined;
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
        `STEAM ${msg.steamid_sender.accountid} executed ${args
            .join(' > ')
            .toUpperCase()} [${cmdArgs.join(', ')}] in ${msg.chat_id}`
    );

    return command.function({ client, msg, args: cmdArgs });
}
