import { DiscordBotCommandProps } from '../configDiscord';

export default function ({ msg }: DiscordBotCommandProps) {
    msg.channel.send("Ping!");
}

export function dong({ msg }: DiscordBotCommandProps) {
    msg.channel.send('Dong!');
}
