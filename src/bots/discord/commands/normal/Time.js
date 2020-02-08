const {
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Normal()
      .setName("TIME")
      .setInfo("Hmmm... Whats the time?")
      .addUse("time", "get the Texan time")
      .addUse("time {timezone name}", "get the specific timezone")
      .setCommand(sendTime);

function sendTime(msg, args) {
    const timeZone = args.length > 0 ? args[0] : "America/Chicago";
    const options = {
        timeZone, hour12: true,
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    try {
        const formatter = new Intl.DateTimeFormat("en-US", options);
        return msg.channel.send(`**${formatter.format(new Date())}**`)
    } catch (error) {
        return msg.channel.send("Wrong timezone name!");
    }
}