/**
 * Imports all the `npm` modules that are
 * specified in the `package.json`
 * 
 * @module Imports
 * @returns {Object} Object with modules
 */
module.exports = { 
    Discord: require("discord.js"),
    tmi: require("tmi.js"),
    request: require("request"),
    Canvas: require("canvas"),
    Store: require("data-store"),
    fs: require("fs"),
    Async: require("async"),
    Prototypes: require("./Prototypes"),
    GFun: require("./GlobalFunctions"),
    google: require("googleapis").google,
    init: init()
}

function init() {
    "[Server][I]: Modules imported".sendLog();
    return new Date();
}