import { CustomCommandsDb } from '../../../database/database';
import { CustomCommand, CustomCommandObject } from '../../../database/objects/CustomCommand';
import { discordMSGR } from '../../../utils/discord';
import { DiscordBotCommandProps } from '../configDiscord';

export default function ({ msg }: DiscordBotCommandProps) {
    return msg.channel.send('Custom Commands');
}

export async function customCommandsAdd({ msg, args }: DiscordBotCommandProps) {
    if (args.length < 2) return discordMSGR(msg, 'missing arguments. Please insert <name> <output>');

    const name = args.shift()?.toUpperCase();
    if (!name) return discordMSGR(msg, 'missing arguments. Please insert <name> <output>');

    const commandOutput = args.join(' ');
    if (await CustomCommandsDb.getById<CustomCommand>(name)) return discordMSGR(msg, 'that command already exists!');

    const output = await CustomCommandsDb.add<CustomCommand, CustomCommand>(
        new CustomCommandObject(name, commandOutput).toJson()
    );

    if (output.result.ok === 1) return discordMSGR(msg, `command **${name}** added.`);
    return discordMSGR(msg, `failed to add command **${name}**. Please contact the administrator.`);
}
