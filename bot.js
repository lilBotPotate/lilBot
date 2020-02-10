const {
    Async,
    fs,
    YAML,
    Universal
} = require("./src/imports/Imports");

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

/** 
 * Creates Discord and Twitch bot
 */
require("./src/imports/functions/CreateBots")().then((areBotsCreated) => {
    if(!areBotsCreated) throw "Failed to create the bots";
});

/** 
 * Initializes the bot API
 */
require("./src/api/api")();

const Updates = require("./src/imports/functions/Updates");
Async.forever(
    function(next) {
        setTimeout(function() {
            try { Updates(); } 
            catch (error) { Universal.sendLog("error", `Failed to run updates:\n${error}`); }
            next();
        }, (Math.floor(Math.random() * 60) + 15) * 1000);
    },
    function(error) { return Universal.sendLog("error", `Failed to run Async.forever (updates):\n${error}`); }
);

const UpdateAvatar = require("./src/imports/functions/UpdateAvatar");
Async.forever(
    function(next) {
        setTimeout(function() {
            try { UpdateAvatar(); } 
            catch (error) { Universal.sendLog("error", `Failed to run UpdateAvatar:\n${error}`); }
            next();
        }, (Math.floor(Math.random() * 2) + 1) * 3600000);
    },
    function(error) { Universal.sendLog("error", `Failed to run Async.forever (UpdateAvatar):\n${error}`); }
);