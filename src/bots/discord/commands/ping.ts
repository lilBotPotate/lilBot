import { DiscordBotCommandProps } from '../configDiscord';
import { DynamicRace } from '../dynamic/DynamicRace';

export default function ({ msg }: DiscordBotCommandProps) {
    new DynamicRace(msg);
}

export function dong({ msg }: DiscordBotCommandProps) {
    msg.channel.send('Dong!');
}
