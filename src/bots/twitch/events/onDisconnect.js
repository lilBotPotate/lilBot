const {
    Universal
} = require("../../../modules/Imports");

module.exports = function(reason) {
    Universal.sendLog("error", `Twitch client disconnected: ${reason}`);
    return Universal.sendToOwner(`Twitch client dissconected! ${reason}`);
};