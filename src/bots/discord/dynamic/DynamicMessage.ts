import Discord from 'discord.js';

export class DynamicMessage {
    protected message?: Discord.Message;
    protected reactionCollector?: Discord.ReactionCollector;

    protected time: number;
    protected reactions: string[];

    constructor(time: number, reactions: string[]) {
        this.time = time;
        this.reactions = reactions;
    }

    protected init(msg: Discord.Message) {
        this.message = msg;
        if (this.reactions.length === 0 || this.time === 0) return;

        Promise.all(this.reactions.map(async (reaction: string) => msg.react(reaction)));
        this.reactionCollector = msg.createReactionCollector(this.collectorFilter.bind(this), {
            time: 1000 * 60 * this.time
        });
        this.reactionCollector.on('collect', this.onCollect.bind(this));
        this.reactionCollector.on('end', this.onEnd.bind(this));
    }

    protected collectorFilter(reaction: Discord.MessageReaction, user: Discord.User): boolean {
        return !user.bot && this.reactions.includes(reaction.emoji.name);
    }

    protected onCollect(reaction: Discord.MessageReaction, user: Discord.User) {
        reaction.users.remove(user.id);
    }

    protected async onEnd(collected: Discord.Collection<string, Discord.MessageReaction>, reason: string) {
        await this.message?.reactions.removeAll();
    }
}
