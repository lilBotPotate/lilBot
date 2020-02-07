/**
 * Logger.
 * @param {('error'|'warn'|'info'|'debug'|'command')} [type=info] Type of the output
 * @param {String} message Message that you want to send to the console
 */
exports.sendLog = (type = "info", message) => {
    const isLinux = process.platform === "linux";
    const today = new Date();
    const date = ("0" + today.getDate()).slice(-2) + "/" 
               + ("0" + (today.getMonth() + 1)).slice(-2) + "/" 
               + today.getFullYear() + " " 
               + ("0" + today.getHours()).slice(-2) + ":" 
               + ("0" + today.getMinutes()).slice(-2) + ":" 
               + ("0" + today.getSeconds()).slice(-2);

    const prefixFormat = (type, start = "", end = "") => `${start}[${date}] ${type} |${end}`;
    const prefix = ({
        "info":    { name: "INFO ", color: "\x1b[36m" },
        "debug":   { name: "DEBUG", color: "\x1b[35m" },
        "error":   { name: "ERROR", color: "\x1b[31m" },
        "warn":    { name: "WARN ", color: "\x1b[33m" },
        "command":  {name: "COMD ", color: "\x1b[32m" }
    })[type];
    const prefixColor = isLinux ? prefix.color : "";
    const prefixEnd = isLinux ? "\x1b[0m" : "";
    const prefixText = prefixFormat(prefix.name, prefixColor, prefixEnd);
    return console.log(`${prefixText} ${message}`);
}

/** 
 * Randomizes the inserted array. Only works on the first level.
 * 
 * @example
 * this.randomizeArray([1, 2, 3])
 * // returns [3, 1, 2]
 * 
 * @param {Array} array
 * @returns {Array} Randomized array
 */
exports.randomizeArray = (array) => {
    let oArray = [...array];
    let newArray = [];
    while (oArray.length > 0) {
        const elPos = Math.floor(Math.random() * oArray.length);
        const el = oArray[elPos];
        newArray.push(el);
        oArray.splice(elPos, 1);
    }
    return newArray;
}

/** 
 * Sends a message to the discord chat from where the original originated
 * and removes it after 2s.
 * 
 * @param {Discord.Message} msg `Discord.Message` object
 * @param {String} message Message that you want to send
 */
exports.temporaryMSG = (msg, message) => {
    msg.channel.send(message).then((m) => {
        setTimeout(function () {
            m.delete().catch();
        }, 2000);
    }).catch();
}

exports.sendTemporary = (msg, message) => {
    msg.channel.send(message).then((m) => {
        setTimeout(function () {
            m.delete().catch();
        }, 2000);
    }).catch();
}

/** 
 * Password generator. 
 * 
 * @example
 * this.generatePassword(5)
 * // returns "g2s8x"
 * 
 * @param {Number} length The length that you want for the password
 * @returns {String} Generated password
 */
exports.generatePassword = (length) => {
    let chars = "abcdefghijklmnpqrstuvwxyz123456789";
    let password = "";
    for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    return password;
}

/** 
 * Random hexadecimal color generator. 
 * 
 * @example 
 * returns "#A07F83"
 * 
 * @returns {String} Generated hex value
 */
exports.randomHexColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return getHexValue(r, g, b);

    function getHexValue(r, g, b) {
        return `#${numberToHex(r)}${numberToHex(g)}${numberToHex(b)}`;
    }

    function numberToHex(num) {
        let hexNum = num.toString(16);
        return hexNum.length == 1 ? "0" + hexNum : hexNum;
    }
}

/** 
 * Send a message to the bot owner on **Discord**
 * 
 * @param {String} message
 * @returns {void}
 */
exports.sendToOwner = (message) => {
    const clientD = global.gClientDiscord;
    const userId = global.gConfig.discord.bot_owner_id;
    return clientD.fetchUser(userId).send(message);
}