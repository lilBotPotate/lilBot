const {
    Store,
    Universal
} = require("../Imports");

/**
 * Creates `Store` objects.
 * 
 * @module Stores
 * @returns {Object} Object with `Store` objects
 */
module.exports = { 
    jQueue: new Store({ path: "./src/db/queue.json", indent: null }),
    jCommands: new Store({ path: "./src/db/commands.json", indent: null }),
    jEnemys: new Store({ path: "./src/db/enemies.json", indent: null }),
    jMods: new Store({ path: "./src/db/mods.json", indent: null }),
    jRocketLeague: new Store({ path: "./src/db/rocket_league.json", indent: null }),
    init: () => {
        Universal.sendLog("info", "Stores initialized");
        return new Date();
    }
}
