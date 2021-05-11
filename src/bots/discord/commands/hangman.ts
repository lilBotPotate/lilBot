import { DiscordBotCommandProps, discordCommands } from '../configDiscord';
import { DynamicHelp } from '../dynamic/DynamicHelp';
import words from '../../../files/json/words.json';
import { DynamicHangman } from '../dynamic/DynamicHangman';

export default function ({ msg, args }: DiscordBotCommandProps) {
    const regex = /\|\|(.*?)\|\|/g;
    const extracted = args.length > 0 && args.join(' ').match(regex)?.[0];
    if (args.length > 0 && !extracted) return msg.reply('the input should be hidden! Example: ||word||');

    const word = extracted
        ? extracted
              .substring(2, extracted.length - 2)
              .trim()
              .toUpperCase()
        : words[Math.floor(Math.random() * words.length)].toUpperCase();

    if (word.length < 1) return msg.reply('word is too short!');
    if (word.length > 50) return msg.reply('word is too long!');

    const letters: any = Array.from(new Set(word)).filter((letter) => letter !== ' ');
    if (letters.length > 19) return msg.reply('Too many different letters... max is 19');

    if (args.length > 0) msg.delete();

    return new DynamicHangman(msg, word, letters);
}
