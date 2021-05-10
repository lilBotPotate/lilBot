import Discord from 'discord.js';
import { DynamicMessage } from './DynamicMessage';

export class DynamicCounter extends DynamicMessage {
    private counter: number = 0;

    constructor(msg: Discord.Message) {
        super(1, ['➖', '➕']);

        msg.channel
            .send(new Discord.MessageEmbed().setDescription(this.generateDescription()))
            .then(this.init.bind(this));
    }

    protected onCollect(reaction: Discord.MessageReaction, user: Discord.User) {
        try {
            reaction.users.remove(user.id);
        } catch (error) {}

        switch (reaction.emoji.name) {
            case '➖':
                this.counter--;
                break;
            case '➕':
                this.counter++;
                break;
            default:
                return;
        }

        return this.updateMessage();
    }

    private updateMessage() {
        const oldEmbed: any = this.message?.embeds[0];
        if (!oldEmbed) return;

        oldEmbed.description = this.generateDescription();
        return this.message?.edit(oldEmbed);
    }

    private generateDescription(): string {
        return `Counter: ${this.counter}`;
    }
}
