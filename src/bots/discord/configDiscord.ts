import Discord from 'discord.js';

// Events
import onReady from './events/onReady';
import onMessage from './events/onMessage';

// Commands
import ping, { dong } from './commands/ping';
import dynamic from './commands/dynamic';
import canvas from './commands/canvas';
import help from './commands/help';
import gamble from './commands/gamble';
import bind, { bindSteam, bindTwitch } from './commands/bind';
import customCommands, { customCommandsAdd } from './commands/customCommands';
import birthday, { birthdaySet, birthdayRemove, birthdayList } from './commands/birthday';
import race from './commands/race';
import hangman from './commands/hangman';
import highLow from './commands/highLow';

export type DiscordBotEvent = {
    type: keyof Discord.ClientEvents;
    function: (...args: any) => void;
};

export const discordEvents: DiscordBotEvent[] = [
    {
        type: 'ready',
        function: onReady
    },
    {
        type: 'message',
        function: onMessage
    }
];

export type DiscordBotCommandProps = {
    client: Discord.Client;
    msg: Discord.Message;
    args: string[];
};

export type DiscordBotCommand = {
    type: 'master' | 'admin' | 'normal';
    description: string;
    usage: [string, string][];
    delay?: number; // milliseconds
    function: (props: DiscordBotCommandProps) => any | Promise<any>;
    subCommands?: DiscordBotCommands;
};

export type DiscordBotCommands = { [key: string]: DiscordBotCommand };

export const discordAdminCommands: DiscordBotCommands = {
    COMMANDS: {
        type: 'admin',
        description: 'Custom commands',
        usage: [['', '']],
        function: customCommands,
        subCommands: {
            ADD: {
                type: 'admin',
                description: 'Custom commands add',
                usage: [['', '']],
                function: customCommandsAdd
            }
        }
    }
};

export const discordNormalCommands: DiscordBotCommands = {
    PING: {
        type: 'normal',
        description: 'Ping Pong command!',
        usage: [['', 'Sends "Pong!"']],
        function: ping,
        subCommands: {
            DONG: {
                type: 'normal',
                description: 'Fake Ping Pong command!',
                usage: [['', 'Sends "Dong!"']],
                delay: 5000,
                function: dong
            }
        }
    },
    DYNAMIC: {
        type: 'normal',
        description: 'Dynamic message example',
        usage: [['', 'Sends dynamic message example']],
        function: dynamic
    },
    CANVAS: {
        type: 'normal',
        description: 'Canvas example',
        usage: [['', 'Sends canvas image example']],
        function: canvas
    },
    HELP: {
        type: 'normal',
        description: 'Help command',
        usage: [['["command name" | "master" | "admin" | "normal"]', 'Sends help']],
        function: help
    },
    GAMBLE: {
        type: 'normal',
        description: 'Gamble',
        usage: [['', '50/50 chance that you win']],
        function: gamble
    },
    BIND: {
        type: 'normal',
        description: 'Account bind help',
        usage: [['', 'Sends acccount bind help']],
        function: bind,
        subCommands: {
            TWITCH: {
                type: 'normal',
                description: 'Bind Twitch account',
                usage: [['', 'Generates a code to bind Twitch account to your Discord account']],
                function: bindTwitch
            },
            STEAM: {
                type: 'normal',
                description: 'Bind Steam account',
                usage: [['', 'Generates a code to bind Steam account to your Discord account']],
                function: bindSteam
            }
        }
    },
    BDAY: {
        type: 'normal',
        description: 'Birthday',
        usage: [['', 'Birthday']],
        function: birthday,
        subCommands: {
            SET: {
                type: 'normal',
                description: 'Birthday set',
                usage: [['', '']],
                function: birthdaySet
            },
            REMOVE: {
                type: 'normal',
                description: 'Birthday remove',
                usage: [['', '']],
                function: birthdayRemove
            },
            LIST: {
                type: 'normal',
                description: 'Birthday list',
                usage: [['', '']],
                function: birthdayList
            }
        }
    },
    RACE: {
        type: 'normal',
        description: 'Race',
        usage: [['', 'Race']],
        delay: 10000,
        function: race
    },
    HANGMAN: {
        type: 'normal',
        description: 'Hangman',
        usage: [['', 'Hangman']],
        function: hangman
    },
    HIGHLOW: {
        type: 'normal',
        description: 'HIGHLOW',
        usage: [['', 'HIGHLOW']],
        function: highLow
    }
};

export const discordCommands: DiscordBotCommands = {
    ...discordAdminCommands,
    ...discordNormalCommands
};

export default {
    discordEvents,
    discordCommands
};
