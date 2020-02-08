const {
    express
} = require("../../../imports/Imports");
const router = express.Router();

router.get('/', function(req, res, next) {
    const client = global.gClientTwitch;
    res.json({
        name: client.username,
        channels: client.opts.channels,
        reconnecting: client.reconnecting,
        reconnect: client.reconnect,
        server: client.server,
        port: client.port
    });
});

module.exports = router;