const {
    fs
} = require("../../../Imports.js");

module.exports = {
    name: "LOG",
    description: {
        "info": "Huh? Did something went wrong :(",
        "uses": {
            "log": "get the latest log file"
        }
    },
    execute(client, msg, args) {
        const logArr = fs.readdirSync("./logs");
        if(!logArr || logArr.length < 1) return msg.channel.send("No log files...");
        const lastLog = logArr[logArr.length - 1];
        msg.channel.send({
            files: [
              `./logs/${lastLog}`
            ]
        });
    }
};