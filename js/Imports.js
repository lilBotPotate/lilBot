module.exports = { 
    Discord: require("discord.js"),
    tmi: require("tmi.js"),
    request: require("request"),
    Canvas: require("canvas"),
    Store: require("data-store"),
    fs: require("fs"),
    Async: require("async"),
    Prototypes: require("./Prototypes.js"),
    GFun: require("./GlobalFunctions.js"),
    google: require("googleapis").google,
    Dotenv: require("dotenv").config(),
    init: init()
}

function init() {
    "[Server][I]: Modules imported".sendLog();
    return new Date();
}