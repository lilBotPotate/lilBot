const {
    Store
} = require("./Imports.js");

module.exports = { 
    jQueue: new Store({ path: "./json/queue.json" }),
    jCommands: new Store({ path: "./json/commands.json" }),
    init: init()
}

function init() {
    "[Server][I]: Stores initialized".sendLog();
    return new Date();
}