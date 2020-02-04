/** 
 * Inserts configs from `./config/.env` into `process.env`
*/
require("dotenv").config({ path: `./src/config/.env` });

/** 
 * Inserts configs from `./config/config.json` into 
 * **NodeJs.Global** object @var gConfig
 * 
 * @type {Object}
 */
global.gConfig = require(`./config/config.json`);

const Tests = require("./test/Config_Test");
for(test in Tests) Tests[test]();

// const {
//     Async
// } = require("./modules/Imports");

// const createBots = require("./modules/CreateBots");
// createBots().then((areBotsCreated) => {
//     if(!areBotsCreated) throw "Failed to create the bots";
// });

// const updates = require("./modules/Updates");
// Async.forever(
//     function(next) {
//         setTimeout(function() {
//             try { updates(); } 
//             catch (error) { `[Error]: ${error}`.sendLog(); }
//             next();
//         }, (Math.floor(Math.random() * 60) + 15) * 1000);
//     },
//     function(err) { return `[Error]: ${err}`.sendLog(); }
// );