import Discord from 'discord.js';
import { CustomCommandsDb } from '../../../database/database';
import { CustomCommand } from '../../../database/objects/CustomCommand';
import { DiscordEmbed } from '../../../utils/discord';
import { discordAdminCommands, DiscordBotCommands, discordNormalCommands } from '../configDiscord';
import { DynamicMessage } from './DynamicMessage';

type HelpPage = {
    type: string;
    data: HelpCommandData[];
};

type HelpCommandData = {
    name: string;
    description?: string;
};

export class DynamicHelp extends DynamicMessage {
    private page: number = 0;
    private pages: HelpPage[] = [];
    private maxPage: number = 0;
    private pageSize: number = 10;

    constructor(msg: Discord.Message) {
        super(2, ['⏮️', '◀️', '▶️', '⏭️']);

        CustomCommandsDb.getAll<CustomCommand>().then((customCommands) => {
            this.pages = [
                ...this.generateTypePages(
                    'Normal',
                    [
                        ...this.generateData(discordNormalCommands, false),
                        ...customCommands.map((customCommand) => ({
                            name: customCommand._id,
                            description: 'custom command'
                        }))
                    ].sort((a, b) => ('' + a.name).localeCompare(b.name))
                ),
                ...this.generateTypePages('Admin', this.generateData(discordAdminCommands))
            ];

            this.maxPage = this.pages.length - 1;

            msg.channel
                .send(
                    DiscordEmbed({
                        title: this.generateTitle(),
                        description: this.generateDescripton(),
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

        oldEmbed.title = this.generateTitle();
        oldEmbed.description = this.generateDescripton();
        oldEmbed.footer = this.generateFooter();
        return this.message?.edit(oldEmbed);
    }

    private generateData(commands: DiscordBotCommands, sort = true): HelpCommandData[] {
        let keys = Object.keys(commands);
        if (sort) keys = keys.sort();

        return keys.map((key) => {
            const command = commands[key];
            return {
                name: key,
                description: command.description
            };
        });
    }

    private generateTypePages(
        type: string,
        data: Array<{
            name: string;
            description?: string;
        }>
    ): HelpPage[] {
        return new Array(Math.ceil(data.length / this.pageSize)).fill(0).map(() => ({
            type,
            data: data.splice(0, this.pageSize)
        }));
    }

    private generateTitle(): Discord.MessageEmbedOptions['title'] {
        const currentPage = this.pages[this.page];
        return `Help ${currentPage.type}`;
    }

    private generateDescripton(): Discord.MessageEmbedOptions['description'] {
        const currentPage = this.pages[this.page];

        if (currentPage.data.length === 0) return 'Empty';
        return (
            currentPage.data
                .map(
                    (command) =>
                        `**${command.name}**${command.description ? ` - ${command.description}` : ''}`
                )
                .join('\n') || 'Empty'
        );
    }

    private generateFooter(): Discord.MessageEmbedOptions['footer'] {
        return { text: `Page ${this.page + 1} of ${this.maxPage + 1}` };
    }
}
