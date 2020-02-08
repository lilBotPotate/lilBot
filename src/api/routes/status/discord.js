const {
    express
} = require("../../../imports/Imports");
const router = express.Router();

router.get('/', function(req, res, next) {
    const client = global.gClientDiscord;
    res.json({
        name: client.user.tag,
        users: client.users.size,
        channels: client.channels.size,
        guilds: client.guilds.size,
        ping: client.ping,
        readyAt: client.readyAt,
        status: client.status,
        uptime: client.uptime
    });
});

module.exports = router;