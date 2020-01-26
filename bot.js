const {
    Async
} = require("./js/Imports");

const createBots = require("./js/CreateBots");
const updates = require("./js/Updates");

/* Adds congifgs from congig.json to a global variable */
global.gConfig = require("./config.json");

/* Creates the discord bots */
createBots();

/* Executes updates every once in a while */
Async.forever(
    function(next) {
        setTimeout(function() {
            try { updates(); } 
            catch (error) { `[Error]: ${error}`.sendLog(); }
            next();
        }, (Math.floor(Math.random() * 60) + 15) * 1000);
    },
    function(err) { return `[Error]: ${err}`.sendLog(); }
);