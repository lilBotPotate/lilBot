import Discord, { GuildMember } from 'discord.js';
import { DiscordEmbed } from '../../../utils/discord';
import { DynamicMessage } from './DynamicMessage';

export class DynamicHighLow extends DynamicMessage {
    private counter: number = 0;
    private users: Map<
        string,
        {
            member: GuildMember;
            position: number;
            reaction: null | number;
            lastReaction: null | number;
            emoji: string;
        }
    >;
    private value: number;
    private lastDifference?: number;
    private size: number;
    private winners?: string[];
    private outOfTime?: boolean;

    constructor(msg: Discord.Message, opponent: Discord.GuildMember) {
        super(5, ['⬇️', '⏺️', '⬆️']);

        this.users = new Map(
            [<Discord.GuildMember>msg.member, opponent].map((member, i) => [
                member.id,
                {
                    member,
                    position: 0,
                    reaction: null,
                    lastReaction: null,
                    emoji: i === 0 ? '🟦' : '🟪'
                }
            ])
        );

        this.value = this.getRandomNumber();
        this.size = 10;

        msg.channel
            .send(
                DiscordEmbed({
                    title: this.generateTitle(),
                    fields: this.generateFields(),
                    description: this.generateDescription()
                })
            )
            .then(this.init.bind(this));
    }

    protected onCollect(reaction: Discord.MessageReaction, user: Discord.User) {
        try {
            reaction.users.remove(user.id);
        } catch (error) {}

        switch (reaction.emoji.name) {
            case '⬇️': {
                const gameUser = this.users.get(user.id);
                if (!gameUser || gameUser.reaction == -1) return;
                this.users.set(user.id, {
                    ...gameUser,
                    reaction: -1
                });
                break;
            }
            case '⏺️': {
                const gameUser = this.users.get(user.id);
                if (!gameUser || gameUser.reaction == 0) return;
                this.users.set(user.id, {
                    ...gameUser,
                    reaction: 0
                });
                break;
            }
            case '⬆️': {
                const gameUser = this.users.get(user.id);
                if (!gameUser || gameUser.reaction == 1) return;
                this.users.set(user.id, {
                    ...gameUser,
                    reaction: 1
                });
                break;
            }
            default: {
                return;
            }
        }

        let reacted = 0;
        this.users.forEach((user) => user.reaction !== null && reacted++);

        if (reacted == 2) return this.bothSelected();
        return this.updateMessage('reacted');
    }

    private updateMessage(type: 'reacted' | 'new' | 'done' | 'time') {
        const oldEmbed: any = this.message?.embeds[0];
        if (!oldEmbed) return;

        switch (type) {
            case 'reacted':
                oldEmbed.fields = this.generateFields();
                break;
            case 'new':
                oldEmbed.title = this.generateTitle();
                oldEmbed.description = this.generateDescription();
                oldEmbed.fields = this.generateFields();
                break;
            case 'done':
                oldEmbed.title = this.generateTitle();
                oldEmbed.description = this.generateDescription();
                oldEmbed.fields = this.generateFields();
                break;
            case 'time':
                oldEmbed.title = this.generateTitle();
                oldEmbed.description = this.generateDescription();
                oldEmbed.fields = this.generateFields();
                break;
            default:
                break;
        }

        return this.message?.edit(oldEmbed);
    }

    private bothSelected() {
        const oldValue = this.value;
        this.value = this.getRandomNumber();
        const difference = this.value === oldValue ? 0 : this.value > oldValue ? 1 : -1;

        const winners: string[] = [];

        this.users.forEach((user) => {
            const correct = user.reaction === difference;
            if (correct) user.position += user.reaction === 0 ? 2 : 1;
            else user.position === 0 ? 0 : (user.position -= 1);

            if (user.position >= this.size - 1) {
                winners.push(user.member.id);
                user.position = this.size - 1;
            }

            user.lastReaction = user.reaction;
            user.reaction = null;
        });

        this.lastDifference = difference;

        if (winners.length > 0) {
            this.winners = winners;
            this.updateMessage('done');
            this.reactionCollector?.stop();
        } else {
            this.updateMessage('new');
        }
    }

    private getRandomNumber(): number {
        return Math.floor(Math.random() * 100) + 1;
    }

    private getEmoji(value: number): string {
        return value === 0 ? '⏺️' : value === -1 ? '⬇️' : '⬆️';
    }

    private generateTitle(): Discord.MessageEmbedOptions['title'] {
        if (this.winners && this.winners.length > 0) {
            return 'Higher or Lower!';
        }
        return `Number ${this.value}${this.lastDifference ? ` ${this.getEmoji(this.lastDifference)}` : ''}`;
    }

    private generateDescription(): Discord.MessageEmbedOptions['description'] {
        const rows: string[] = [];

        this.users.forEach((user) => {
            rows.push('⬛'.repeat(user.position) + user.emoji + '⬛'.repeat(this.size - user.position - 1));
        });

        if (this.winners && this.winners.length > 0) {
            rows.push('\u2008');
            this.users.forEach((user) => {
                const won = user.member.id === this.winners?.[0];
                rows.push(`${user.emoji} <@${user.member.id}> ${won ? '🏆' : ''}`);
            });
        } else if (this.outOfTime) {
            rows.push('\u2008');
            rows.push('Out of time!');
            this.users.forEach((user) => rows.push(`${user.emoji} <@${user.member.id}>`));
        }

        return rows.join('\n') || 'Error';
    }

    private generateFields(): Discord.MessageEmbedOptions['fields'] {
        if (this.winners && this.winners.length > 0 || this.outOfTime) return [];
        const fields: Discord.MessageEmbedOptions['fields'] = [];
        this.users.forEach((user) => {
            fields.push({
                name: `${user.emoji} ${user.member.displayName}`,
                value: user.reaction === null ? 'React!' : this.getEmoji(user.reaction),
                inline: true
            });
        });

        return fields;
    }

    protected async onEnd(collected: Discord.Collection<string, Discord.MessageReaction>, reason: string) {
        if (!this.winners || this.winners.length === 0) {
            this.outOfTime = true;
            this.updateMessage('time');
        }

        await this.message?.reactions.removeAll();
    }
}
