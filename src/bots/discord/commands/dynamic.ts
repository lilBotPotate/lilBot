import { DiscordBotCommandProps } from '../configDiscord';
import { DynamicCounter } from '../dynamic/DynamicCounter';

export default function ({ msg }: DiscordBotCommandProps) {
    return new DynamicCounter(msg);
}
