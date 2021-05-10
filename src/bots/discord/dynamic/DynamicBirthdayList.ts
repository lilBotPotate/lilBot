import Discord from 'discord.js';
import { UsersDb } from '../../../database/database';
import { User } from '../../../database/objects/User';
import { DiscordEmbed } from '../../../utils/discord';
import { formatDate } from '../../../utils/general';
import { DynamicMessage } from './DynamicMessage';

export class DynamicBirthdayList extends DynamicMessage {
    private page: number = 0;
    private pageSize: number = 5;
    private maxPage: number = 0;
    private users: User[] = [];
    private today: { day: number; month: number } = { day: 0, month: 0 };

    constructor(msg: Discord.Message) {
        super(3, ['⏮️', '◀️', '▶️', '⏭️']);

        UsersDb.getByParams<User>({ birthday: { $ne: null } }, (cursor) =>
            cursor.sort({ 'birthday.month': 1, 'birthday.day': 1, 'birthday.year': 1 })
        ).then((users = []) => {
            if (users.length === 0)
                return msg.channel.send(
                    DiscordEmbed({
                        title: 'Birthdays',
                        description: 'No birthdays stored... 😢'
                    })
                );

            const date = new Date();
            this.today = {
                day: date.getDate(),
                month: date.getMonth() + 1
            };

            let index = users.findIndex(
                (user) =>
                    user.birthday?.day &&
                    user.birthday?.month &&
                    user.birthday.month >= this.today.month &&
                    user.birthday.day >= this.today.day
            );
            if (index === -1) index = 0;

            const pastUsers = users.splice(0, index);
            this.users = [...users, ...pastUsers];

            this.maxPage = Math.ceil(this.users.length / this.pageSize) - 1;
            msg.channel
                .send(
                    DiscordEmbed({
                        title: 'Birthdays',
                        description: this.generateDescription(),
                        footer: this.generateFooter()
                    })
                )
                .then(this.init.bind(this));
        });
    }

    protected onCollect(reaction: Discord.MessageReaction, user: Discord.User) {
        try {
            reaction.users.remove(user.id);
        } catch (error) {}

        switch (reaction.emoji.name) {
            case '⏮️': {
                if (this.page <= 0) return;
                this.page = 0;
                break;
            }

            case '◀️': {
                if (this.page - 1 < 0) return;
                this.page--;
                break;
            }

            case '▶️': {
                if (this.page + 1 > this.maxPage) return;
                this.page++;
                break;
            }

            case '⏭️': {
                if (this.page >= this.maxPage) return;
                this.page = this.maxPage;
                break;
            }

            default:
                return;
        }

        return this.updateMessage();
    }

    private updateMessage() {
        const oldEmbed: any = this.message?.embeds[0];
        if (!oldEmbed) return;

        oldEmbed.description = this.generateDescription();
        oldEmbed.footer = this.generateFooter();
        return this.message?.edit(oldEmbed);
    }

    private generateDescription(): Discord.MessageEmbedOptions['description'] {
        const birthdays: string[] = [];
        for (let i = this.page * this.pageSize; i < (this.page + 1) * this.pageSize; i++) {
            if (i >= this.users.length) continue;
            const user = this.users[i];
            const hasBirthday =
                user.birthday !== null &&
                user.birthday.day === this.today.day &&
                user.birthday.month == this.today.month;

            birthdays.push(
                `${hasBirthday ? '🎂 ' : ''}<@${user._id}> ... **${formatDate(
                    user.birthday?.day || 0,
                    user.birthday?.month || 0
                )}**`
            );
        }

        return birthdays.join('\n');
    }

    private generateFooter(): Discord.MessageEmbedOptions['footer'] {
        return { text: `Page ${this.page + 1} of ${this.maxPage + 1}` };
    }
}
