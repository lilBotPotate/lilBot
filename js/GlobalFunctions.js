module.exports = {
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

    temporaryMSG: function(msg, message) {
        msg.channel.send(message).then((m) => {
            setTimeout(function () {
                m.delete().catch();
            }, 2000);
        }).catch();
    },

    generatePassword: function(length) {
        let chars = "abcdefghijklmnpqrstuvwxyz123456789";
        let password = "";
        for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
        return password;
    },

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