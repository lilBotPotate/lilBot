import { UsersDb } from '../../../database/database';
import { User } from '../../../database/objects/User';
import { getOrCreateUser } from '../../../handlers/user/UserHandlers';
import { discordMSGR } from '../../../utils/discord';
import { formatCount } from '../../../utils/general';
import { DiscordBotCommandProps } from '../configDiscord';

export default async function ({ msg, args }: DiscordBotCommandProps) {
    const amount = args.shift();
    if (!amount) return msg.channel.send('You have to specify the amount!');

    let user: User | undefined = await getOrCreateUser(msg.author.id);
    if (!user) return msg.channel.send('Failed to fetch User... Please contact the administrator.');

    let points = user.points;
    let calculated = calculatePoints(points, amount);
    if (calculated.error || !calculated.points)
        return discordMSGR(
            msg,
            calculated.error || 'you need to input either a number, percentage or "all"'
        );

    const hasWon = Math.random() >= 0.5;
    if (hasWon) points += calculated.points;
    else points -= calculated.points;

    const output = await UsersDb.updateById(msg.author.id, { points });
    if (output.result.ok == 1) {
        discordMSGR(
            msg,
            `you just ${hasWon ? 'won' : 'lost'} **${formatCount(
                'point',
                calculated.points
            )}**! You now have **${formatCount('point', points)}**!`
        );
    } else {
        msg.channel.send('Failed to update users points... Please contact the administrator.');
    }
}

function calculatePoints(points: number, amount: string): { points?: number; error?: string } {
    if (points <= 0) {
        return {
            error: "you don't have any points!"
        };
    }

    const handleAll = (): { points?: number; error?: string } => ({
        points
    });

    const handlePercentage = (): { points?: number; error?: string } => {
        const newAmount = amount.slice(0, -1);
        if (Number.isNaN(newAmount)) {
            return {
                error: 'percentage format is: <number>%'
            };
        }

        const percentage = Number.parseFloat(amount);
        if (!Number.isInteger(percentage)) {
            return {
                error: 'you have to input a whole number bigger than 1!'
            };
        }

        return {
            points: Math.round(points * (percentage / 100))
        };
    };

    const handleNumber = (): { points?: number; error?: string } => {
        const newPoints = Number.parseFloat(amount);
        if (!Number.isInteger(newPoints)) {
            return {
                error: 'you have to input a whole number bigger than 1!'
            };
        } else if (newPoints <= 0) {
            return {
                error: 'you have to input a number bigger than 1!'
            };
        } else if (newPoints > points) {
            return {
                error: "you don't have that many points!"
            };
        }

        return {
            points: newPoints
        };
    };

    if (amount.toUpperCase() === 'ALL') return handleAll();
    if (amount.endsWith('%')) return handlePercentage();
    if (!Number.isNaN(amount)) return handleNumber();

    return {
        error: 'you have to input either a number, percentage or "all"'
    };
}
