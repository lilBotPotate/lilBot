const Store = require("data-store");
const Universal = require("../functions/Universal");

/**
 * Creates `Store` objects.
 * 
 * @module Stores
 * @returns {Object} Object with `Store` objects
 */
module.exports = { 
    jQueue: new Store({ path: "./src/db/general/queue.json", indent: null }),
    jCommands: new Store({ path: "./src/db/general/commands.json", indent: null }),
    jEnemys: new Store({ path: "./src/db/general/enemies.json", indent: null }),
    jMods: new Store({ path: "./src/db/general//mods.json", indent: null }),
    jRocketLeague: new Store({ path: "./src/db/general/rocket_league.json", indent: null }),
    init: init()
}

function init() {
    Universal.sendLog("info", "Stores initialized");
    return new Date();
}
