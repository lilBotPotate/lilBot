import Discord from 'discord.js';
import { executeCommand, isCommand } from '../../../handlers/command/CommandHandlers';
import { logger } from '../../../utils/logger';

export default function (this: Discord.Client, msg: Discord.Message) {
    if (msg.author.bot) return;
    logger.debug(msg.author.avatarURL());
    logger.debug(`Message: ${msg.author.username} ${msg.content}`);
    if (isCommand(msg)) return executeCommand(this, msg);
}
