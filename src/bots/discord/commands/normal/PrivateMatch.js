const {
    Command,
} = require("../../../../imports/Imports");

const {
    wsPrivateMatch
} = require("../../../../imports/functions/WebSockets");

module.exports = new Command.Normal("PM")
      .setInfo("Command For private matches!")
      .setCommand(() => console.log("haha"))
      .disable();


