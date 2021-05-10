import Discord from 'discord.js';
import {
    DiscordBotCommand,
    DiscordBotCommands,
    discordCommands as defaultCommands
} from '../../bots/discord/configDiscord';
import { CustomCommandsDb } from '../../database/database';
import { CustomCommand } from '../../database/objects/CustomCommand';
import { discordMSGR } from '../../utils/discord';
import { formatCount } from '../../utils/general';
import { logger } from '../../utils/logger';

const lastCommandExecution: { [key: string]: number } = {};

export function isCommand(msg: Discord.Message): boolean {
    if (!process.env.PREFIX) return false;
    return msg.content.startsWith(process.env.PREFIX);
}

export function executeCommand(client: Discord.Client, msg: Discord.Message) {
    if (!msg.guild) return logger.warn('DM command');
    if (!process.env.PREFIX) return logger.error('Missing "PREFIX" environment variable');

    const args: string[] = msg.content.slice(process.env.PREFIX.length).split(/ +/) || [];

    let commands: DiscordBotCommands = defaultCommands;
    let command: DiscordBotCommand | undefined;
    let index: number = 0;

    let commandChain = [];
    for (let i = 0; i < args.length; i++) {
        const id = args[i].toUpperCase();
        if (!commands[id]) break;
        commandChain.push(id);

        command = commands[id];
        index = i + 1;

        if (!command.subCommands) break;
        commands = command.subCommands;
    }

    if (!command) {
        return CustomCommandsDb.getById<CustomCommand>(args.shift()?.toUpperCase()).then(
            (customCommand: CustomCommand) => {
                if (!customCommand) return;
                const output = formatCustomCommand(customCommand.output, msg);
                if (!output) return;
                if (output.error) return discordMSGR(msg, output.error);
                return msg.channel.send(output?.output || 'Error');
            }
        );
    }

    if (canExecute(command, msg, client)) {
        const cmdArgs = args.splice(index);
        const attachments =
            msg.attachments.size == 0 ? '' : ` with ${formatCount('attachment', msg.attachments.size)}`;

        logger.command(
            `DISCORD ${msg.author.id} executed ${args.join(' > ').toUpperCase()} [${cmdArgs.join(
                ', '
            )}]${attachments} in ${msg.channel.id}`
        );

        if (command.delay) {
            const key = commandChain.join('-');
            if (lastCommandExecution[key]) {
                const difference = Date.now() - lastCommandExecution[key];
                if (difference < command.delay) {
                    return msg.reply(
                        `this command can be executed in **${Math.round((command.delay - difference) / 1000)} seconds**`
                    );
                }
            }

            lastCommandExecution[key] = Date.now();
        }

        return command.function({ msg, args: cmdArgs, client });
    }
}

function canExecute(command: DiscordBotCommand, msg: Discord.Message, client: Discord.Client): boolean {
    return true;
}

function formatCustomCommand(output: any, msg: Discord.Message): { output?: string; error?: string } {
    output = output
        .replace(new RegExp('-M', 'g'), `<@${msg.author.id}>`)
        .replace(new RegExp('-C', 'g'), `<#${msg.channel.id}>`);

    output = insertMentions(output, '-m', '@', msg.mentions.users);
    if (typeof output !== 'string') {
        return {
            error: `missing ${output} user mention${output == 1 ? '' : 's'}`
        };
    }

    output = insertMentions(output, '-c', '#', msg.mentions.channels);
    if (typeof output !== 'string') {
        return {
            error: `missing ${output} channel mention${output == 1 ? '' : 's'}`
        };
    }

    output = insertMentions(output, '-r', '@&', msg.mentions.roles);
    if (typeof output !== 'string') {
        return {
            error: `missing ${output} role mention${output == 1 ? '' : 's'}`
        };
    }

    return { output };

    function insertMentions(
        formatted: string,
        symbol: string,
        at: string,
        mentions: Discord.Collection<string, any>
    ): string | number {
        const requiredMentions = (formatted.match(new RegExp(symbol, 'g')) || []).length;
        if (requiredMentions > mentions.size) return requiredMentions - mentions.size;
        const mentionsArray = mentions.array();
        const split = formatted.split(symbol);
        return split
            .map((data, i) => (i < split.length - 1 ? data + `<${at}${mentionsArray[i].id}>` : data))
            .join('');
    }
}
