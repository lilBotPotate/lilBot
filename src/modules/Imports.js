/**
 * Imports all the `npm` modules that are
 * specified in the `package.json`
 * 
 * @module Imports
 * @returns {Object} Object with modules
 */
module.exports = { 
    Universal: require("./Universal"),
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