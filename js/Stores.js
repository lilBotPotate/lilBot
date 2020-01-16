const {
    Store
} = require("./Imports.js");

module.exports = { 
    jQueue: new Store({ path: "./json/queue.json", indent: null }),
    jCommands: new Store({ path: "./json/commands.json", indent: null }),
    jEnemys: new Store({ path: "./json/enemies.json", indent: null }),
    init: init()
}

function init() {
    "[Server][I]: Stores initialized".sendLog();
    return new Date();
}