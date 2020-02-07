/**
 * Imports all the `npm` imports that are
 * specified in the `package.json`
 * 
 * @module Imports
 * @returns {Object} Object with imports
 */
module.exports = { 
    Universal: require("./functions/Universal"),
    Command: require("./classes/Command"),
    Discord: require("discord.js"),
    tmi: require("tmi.js"),
    request: require("request"),
    Canvas: require("canvas"),
    Store: require("data-store"),
    fs: require("fs"),
    Async: require("async"),
    google: require("googleapis").google,
    YAML: require("yaml"),
    init: () => {
        this.Universal.sendLog("info", "Modules imported");
        return new Date();
    }
}