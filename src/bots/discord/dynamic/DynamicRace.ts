import Discord from 'discord.js';
import { DiscordEmbed } from '../../../utils/discord';
import { DynamicMessage } from './DynamicMessage';

export class DynamicRace extends DynamicMessage {
    private counter: number = 0;
    private characters: Array<{
        emoji: string;
        position: number;
    }>;
    private size: number = 15;
    private interval?: NodeJS.Timeout;
    private end: boolean = false;

    constructor(msg: Discord.Message) {
        super(0, []);
        // TODO: characters in config
        this.characters = [
            {
                emoji: '<:pazu:839878184450785300>',
                position: 0
            },
            {
                emoji: '<:suki:839878184446066778>',
                position: 0
            }
        ];

        msg.channel
            .send(
                DiscordEmbed({
                    title: 'Race',
                    description: this.generateDescription()
                })
            )
            .then((message) => {
                this.init.bind(this)(message);
                this.interval = setInterval(this.updateRace.bind(this), 1500);
            });
    }

    private updateMessage() {
        const oldEmbed: any = this.message?.embeds[0];
        if (!oldEmbed) return;

        oldEmbed.description = this.generateDescription();
        return this.message?.edit(oldEmbed);
    }

    private updateRace() {
        console.log("updateRace");
        
        if (this.end) return;
        console.log(this.characters);

        this.characters = this.characters.map((character) => {
            character.position += Math.floor(Math.random() * 3) + 1;
            if (character.position >= this.size) {
                character.position = this.size;
                this.end = true;
            }

            return character;
        });

        if (this.end) {
            if (this.interval) {
                console.log("clear interval");
                clearInterval(this.interval);
            }
        }
        return this.updateMessage();
    }

    private generateDescription(): string {
        return this.characters
            .map((character) => {
                let output = '> ';
                for (let i = 0; i < this.size + 2; i++) {
                    if (character.position === i) {
                        output += character.emoji;
                    } else if (i === this.size + 1) {
                        if (character.position === this.size) {
                            output += '🏆';
                        } else {
                            if(!this.end) output += '🏁';
                        }
                    } else {
                        output += '\u3000';
                    }
                }

                return output;
            })
            .join('\n');
    }
}
