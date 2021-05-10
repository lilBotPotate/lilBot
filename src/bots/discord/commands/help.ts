import { DiscordBotCommandProps, discordCommands } from '../configDiscord';
import { DynamicHelp } from '../dynamic/DynamicHelp';

export default function ({ msg, args }: DiscordBotCommandProps) {
    // const commandName = args.shift()
    new DynamicHelp(msg);
}
