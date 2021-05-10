import dateFormat from 'dateformat';

export const colors = {
    RESET: '\x1b[0m',
    BLACK: {
        FG: '\x1b[30m',
        BG: '\x1b[40m'
    },
    RED: {
        FG: '\x1b[31m',
        BG: '\x1b[41m'
    },
    GREEN: {
        FG: '\x1b[32m',
        BG: '\x1b[42m'
    },
    YELLOW: {
        FG: '\x1b[33m',
        BG: '\x1b[43m'
    },
    BLUE: {
        FG: '\x1b[34m',
        BG: '\x1b[44m'
    },
    MAGENTA: {
        FG: '\x1b[35m',
        BG: '\x1b[45m'
    },
    CYAN: {
        FG: '\x1b[36m',
        BG: '\x1b[46m'
    },
    WHITE: {
        FG: '\x1b[37m',
        BG: '\x1b[47m'
    },
    GRAY: {
        FG: '\x1b[90m',
        BG: '\x1b[100m'
    },
    BRIGHT_RED: {
        FG: '\x1b[91m',
        BG: '\x1b[101m'
    },
    BRIGHT_GREEN: {
        FG: '\x1b[92m',
        BG: '\x1b[102m'
    },
    BRIGHT_YELLOW: {
        FG: '\x1b[93m',
        BG: '\x1b[103m'
    },
    BRIGHT_BLUE: {
        FG: '\x1b[94m',
        BG: '\x1b[104m'
    },
    BRIGHT_MAGENTA: {
        FG: '\x1b[95m',
        BG: '\x1b[105m'
    },
    BRIGHT_CYAN: {
        FG: '\x1b[96m',
        BG: '\x1b[106m'
    },
    BRIGHT_WHITE: {
        FG: '\x1b[97m',
        BG: '\x1b[107m'
    }
};

type LogTypes = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'FATAL' | 'DB' | 'CMD' | 'TMI';

const logColors: { [key in LogTypes]: string } = {
    ERROR: colors.RED.FG,
    WARN: colors.YELLOW.FG,
    INFO: colors.BRIGHT_CYAN.FG,
    DEBUG: colors.YELLOW.BG,
    FATAL: colors.RED.BG,
    DB: colors.BLUE.FG,
    CMD: colors.GREEN.FG,
    TMI: colors.MAGENTA.FG
};

const logTypePadding = Object.keys(logColors).reduce(
    (previous, current) => (current.length > previous ? current.length : previous),
    0
);

const enableColor = process.platform !== 'win32';

export const logger = {
    error: (...args: any) => log('ERROR', null, ...args),
    warn: (...args: any) => log('WARN', null, ...args),
    info: (...args: any) => log('INFO', null, ...args),
    debug: (...args: any) => log('DEBUG', null, ...args),
    fatal: (...args: any) => log('FATAL', null, ...args),
    database: (...args: any) => log('DB', null, ...args),
    command: (...args: any) => log('CMD', null, ...args),
    tmi: {
        info: (message: string) => message[0] !== '[' && log('TMI', null, message),
        warn: (message: string) => message[0] !== '[' && log('TMI', logColors.WARN, message),
        error: (message: string) => message[0] !== '[' && log('TMI', logColors.ERROR, message)
    }
};

function log(type: LogTypes, color: null | string, ...args: any) {
    const typeString = enableColor
        ? `${color || logColors[type]} ${type.padEnd(logTypePadding)} |${colors.RESET}`
        : `${type.padEnd(logTypePadding)} |`;

    console.log(`[${getTime()}] ${typeString} `, ...args);
    if (type == 'FATAL') process.exit(1);
}

function getTime(): string {
    const now = new Date();
    return dateFormat(now, 'dd-mm-yyyy HH:MM:ss');
}
