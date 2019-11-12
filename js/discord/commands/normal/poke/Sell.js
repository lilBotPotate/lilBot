const {
    Discord
} = require("../../../../Imports.js");

module.exports = function(msg, args, trainer) {
    if(args.lenght < 1) return msg.channel.send("You need to specify which pokemon!");
    const type = args.shift().toLowerCase();
    const shiny = args[0] && args.shift().toUpperCase() == "SHINY" ? true : false;
};