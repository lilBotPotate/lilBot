/**
 * Module that creates functions to use globally 
 * 
 * @module GlobalFunctions
 * @returns {Object} Object with functions
 */
module.exports = {
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
    randomizeArray: function(array) {
        let oArray = [...array];
        let newArray = [];
        while(oArray.length > 0) {
            const elPos = Math.floor(Math.random() * oArray.length);
            const el = oArray[elPos];
            newArray.push(el);
            oArray.splice(elPos, 1);
        }
        return newArray;
    },

    /** 
     * Sends a message to the discord chat from where the original originated
     * and removes it after 2s.
     * 
     * @param {Discord.Message} msg `Discord.Message` object
     * @param {String} message Message that you want to send
     */
    temporaryMSG: function(msg, message) {
        msg.channel.send(message).then((m) => {
            setTimeout(function () {
                m.delete().catch();
            }, 2000);
        }).catch();
    },

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
    generatePassword: function(length) {
        let chars = "abcdefghijklmnpqrstuvwxyz123456789";
        let password = "";
        for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
        return password;
    },

    /** 
     * Random hexadecimal color generator. 
     * 
     * @example 
     * returns "#A07F83"
     * 
     * @returns {String} Generated hex value
     */
    randomHexColor: function() {
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
}