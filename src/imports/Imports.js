const Universal = require("./functions/Universal");
const Command = require("./classes/Command");
const Route = require("./functions/Route");
const Database = require("./database/Database");

/**
 * Imports all the `npm` imports that are
 * specified in the `package.json`
 * 
 * @module Imports
 * @returns {Object} Object with imports
 */
module.exports = { 
    Universal, Command, Route, Database,
    Discord: require("discord.js"),
    tmi: require("tmi.js"),
    request: require("request"),
    Canvas: require("canvas"),
    Store: require("data-store"),
    fs: require("fs"),
    Async: require("async"),
    google: require("googleapis").google,
    YAML: require("yaml"),
    bcrypt: require("bcrypt"),
    glob: require("glob"),
    express: require("express"),
    init: init()
}

function init() {
    Universal.sendLog("info", "Modules imported");
    return new Date();
}