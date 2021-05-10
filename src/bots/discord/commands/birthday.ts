import { UsersDb } from '../../../database/database';
import { User } from '../../../database/objects/User';
import { getOrCreateUser } from '../../../handlers/user/UserHandlers';
import { discordMSGR } from '../../../utils/discord';
import { formatDate } from '../../../utils/general';
import { DiscordBotCommandProps } from '../configDiscord';
import { DynamicBirthdayList } from '../dynamic/DynamicBirthdayList';

export default async function ({ msg }: DiscordBotCommandProps) {
    let user: User | undefined = await getOrCreateUser(msg.author.id);
    if (!user) return discordMSGR(msg, 'failed to create a new user... Please contact the administrator.');

    if (!user.birthday) return discordMSGR(msg, "you didn't set your birthday.");

    return discordMSGR(
        msg,
        `your birthday is **${formatDate(user.birthday.day, user.birthday.month, user.birthday.year)}**.`
    );
}

export async function birthdaySet({ msg, args }: DiscordBotCommandProps) {
    if (args.length < 2) return discordMSGR(msg, 'please input `<day> <month> [year].`');

    const day: number = Number.parseInt(args[0]);
    if (day === NaN || day < 1 || day > 31) {
        return discordMSGR(msg, 'for `<day>` please input a number between 1 and 31.');
    }

    const month: number = Number.parseInt(args[1]);
    if (month === NaN || month < 1 || month > 12) {
        return discordMSGR(msg, 'for `<month>` please input a number between 1 and 12.');
    }

    const year: number | null = Number.parseInt(args[2] || '') || null;

    let user: User | undefined = await getOrCreateUser(msg.author.id);
    if (!user) return discordMSGR(msg, 'failed to create a new user... Please contact the administrator.');

    const output = await UsersDb.updateById<{ birthday: User['birthday'] }>(user._id, {
        birthday: { day, month, year }
    });

    if (output.result.ok === 1) discordMSGR(msg, `birthday saved! **${formatDate(day, month, year)}**.`);
    else discordMSGR(msg, 'failed to save your birthday... Please contact the administrator.');
}

export async function birthdayRemove({ msg }: DiscordBotCommandProps) {
    let user: User | undefined = await getOrCreateUser(msg.author.id);
    if (!user) return discordMSGR(msg, 'failed to create a new user... Please contact the administrator.');
    if (!user.birthday) return discordMSGR(msg, "you didn't set your birthday.");

    const output = await UsersDb.updateById<{ birthday: User['birthday'] }>(user._id, {
        birthday: null
    });

    if (output.result.ok === 1) discordMSGR(msg, `birthday removed!`);
    else discordMSGR(msg, 'failed to remove your birthday... Please contact the administrator.');
}

export function birthdayList({ msg }: DiscordBotCommandProps) {
    return new DynamicBirthdayList(msg);
}
