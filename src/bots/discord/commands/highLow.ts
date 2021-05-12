import { DiscordBotCommandProps } from '../configDiscord';
import { DynamicHighLow } from '../dynamic/DynamicHighLow';

export default function ({ msg }: DiscordBotCommandProps) {
    const opponent = msg.mentions.members?.filter((member) => member.id !== msg.author.id)?.first();
    if (!opponent) return msg.reply('you have to mention your opponent!');

    return new DynamicHighLow(msg, opponent);
}
