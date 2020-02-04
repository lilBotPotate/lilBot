const {
    Store
} = require("./Imports.js.js.js");

/**
 * Creates `Store` objects.
 * 
 * @module Stores
 * @returns {Object} Object with `Store` objects
 */
module.exports = { 
    jQueue: new Store({ path: "./json/queue.json", indent: null }),
    jCommands: new Store({ path: "./json/commands.json", indent: null }),
    jEnemys: new Store({ path: "./json/enemies.json", indent: null }),
    jMods: new Store({ path: "./json/mods.json", indent: null }),
    jRocketLeague: new Store({ path: "./json/rocket_league.json", indent: null }),
    init: init()
}

function init() {
    "[Server][I]: Stores initialized".sendLog();
    return new Date();
}