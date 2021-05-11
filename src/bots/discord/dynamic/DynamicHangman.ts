import Discord from 'discord.js';
import { DiscordEmbed } from '../../../utils/discord';
import { emojiToLetter, letterToEmoji, shuffleArray } from '../../../utils/general';
import { logger } from '../../../utils/logger';
import { DynamicMessage } from './DynamicMessage';

/*
⬛🥺⬛
👋👕🤙
⬛👖⬛
*/
type Letters = Array<keyof typeof letterToEmoji>;

export class DynamicHangman extends DynamicMessage {
    private word: Array<{ letter: string; found: boolean } | null>;
    private wrongGuesses: Set<string>;
    private correctGuesses: Set<string>;

    constructor(msg: Discord.Message, word: string, wordLetters: Letters) {
        logger.debug('New DynamicHangman', word);
        const letters = shuffleArray([
            ...wordLetters,
            ...shuffleArray(
                <Letters>Object.keys(letterToEmoji).filter((letter) => !(wordLetters as any).includes(letter))
            ).slice(0, 20 - wordLetters.length)
        ]);

        super(
            5,
            letters.sort().map((letter) => letterToEmoji[letter])
        );

        this.word = [];
        this.correctGuesses = new Set<string>();
        this.wrongGuesses = new Set<string>();

        for (const letter of word) {
            if (letter === ' ') this.word.push(null);
            else {
                this.word.push({
                    letter: letter,
                    found: false
                });
            }
        }

        msg.channel
            .send(
                DiscordEmbed({
                    title: this.generateWord(),
                    fields: [
                        {
                            name: 'Wrong Guesses',
                            value: 'Empty'
                        }
                    ],
                    description: 'Imagine hangman'
                })
            )
            .then(this.init.bind(this));
    }

    protected onCollect(reaction: Discord.MessageReaction, user: Discord.User) {
        try {
            reaction.remove();
        } catch (error) {}

        const letter = (emojiToLetter as any)[reaction.emoji.name];
        if (!letter || this.correctGuesses.has(letter) || this.wrongGuesses.has(letter)) return;

        let foundLetters = 0;
        let doneCounter = 0;
        this.word = this.word.map((element) => {
            if (!element || element.found) {
                doneCounter++;
                return element;
            }
            const found = element.letter === letter;
            if (found) foundLetters++;
            element.found = found;
            if (element.found) doneCounter++;
            return element;
        });

        if (foundLetters > 0) this.correctGuesses.add(letter);
        else this.wrongGuesses.add(letter);

        const end = doneCounter === this.word.length;

        if (end) return this.endGame();
        return this.updateMessage();
    }

    private updateMessage(end?: boolean) {
        const oldEmbed: any = this.message?.embeds[0];
        if (!oldEmbed) return;

        oldEmbed.title = this.generateWord();
        oldEmbed.fields = [
            {
                name: 'Wrong Guesses',
                value: this.wrongGuesses.size > 0 ? Array.from(this.wrongGuesses).sort().join(', ') : 'Empty'
            }
        ];

        if (end) {
            oldEmbed.description = 'Ended';
        }

        return this.message?.edit(oldEmbed);
    }

    private endGame() {
        this.updateMessage(true);
        this.reactionCollector?.stop();
    }

    private generateWord(): string {
        return (
            '``` ' +
            this.word
                .map((letter) => {
                    if (!letter) return '\u2008';
                    return letter.found ? letter.letter : '_';
                })
                .join(' ') +
            ' ```'
        );
    }
}
