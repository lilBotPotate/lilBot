import tmi from 'tmi.js';

// Events
import onMessage from './events/onMessage';

// Commands
import bind from './commands/bind';

export type TwitchBotEvent = {
    type: keyof tmi.Events;
    function: (...args: any) => void;
};

export const twitchEvents: TwitchBotEvent[] = [
    {
        type: 'message',
        function: onMessage
    }
];

export type TwitchBotCommandProps = {
    client: tmi.Client;
    channel: string;
    tags: tmi.ChatUserstate;
    message: string;
    args: string[];
};

export type TwitchBotCommand = {
    description: string;
    function: (props: TwitchBotCommandProps) => any | Promise<any>;
    subCommands?: TwitchBotCommands;
};

export type TwitchBotCommands = { [key: string]: TwitchBotCommand };

export const twitchCommands: TwitchBotCommands = {
    BIND: {
        description: 'Bind Twitch account to Discord account',
        function: bind
    }
};

export default {
    twitchEvents,
    twitchCommands
};
