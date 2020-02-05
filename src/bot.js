const {
    Async,
    fs,
    YAML
} = require("./modules/Imports");

/** 
 * Inserts configs from `./config/.env` into `process.env`
*/
require("dotenv").config({ path: `./src/config/.env` });

/** 
 * Inserts configs from `./config/config.yaml` into 
 * **NodeJs.Global** object @var gConfig
 * 
 * @type {Object}
 */
global.gConfig = YAML.parse(fs.readFileSync("./src/config/config.yaml", "utf8"));

// const createBots = require("./modules/CreateBots");

require("./modules/CreateBots")().then((areBotsCreated) => {
    if(!areBotsCreated) throw "Failed to create the bots";
});

const updates = require("./modules/Updates");
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