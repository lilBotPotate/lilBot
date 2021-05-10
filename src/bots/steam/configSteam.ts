// Events
import onError from './events/onError';
import onLoggedOn from './events/onLoggedOn';

// Chat Events
import onChatError from './events/onChatError';
import onChatMessage, { SteamChatMessage } from './events/onChatMessage';

// Commands
import bind from './commands/bind';

export type SteamBotEvent = {
    type: string;
    function: (...args: any) => void;
};

export const steamEvents: SteamBotEvent[] = [
    {
        type: 'loggedOn',
        function: onLoggedOn
    },
    {
        type: 'error',
        function: onError
    }
];

export const steamChatEvents: SteamBotEvent[] = [
    {
        type: 'chatMessage',
        function: onChatMessage
    },
    {
        type: 'error',
        function: onChatError
    }
];

export type SteamBotCommandProps = {
    client: any;
    msg: SteamChatMessage;
    args: string[];
};

export type SteamBotCommand = {
    function: ({}: SteamBotCommandProps) => any | Promise<any>;
    subCommands?: SteamBotCommands;
};

export type SteamBotCommands = { [key: string]: SteamBotCommand };

export const steamCommands: SteamBotCommands = {
    BIND: {
        function: bind
    }
};

export default {
    steamEvents,
    steamChatEvents,
    steamCommands
};
