const {
    ServerSocket,
    Universal,
    Discord
} = require("../../imports/Imports");

module.exports = (io, app, path) => new ServerSocket(io, app, path)
.request.API.GET("/getStatus", async function(req, res) {
    const client = global.gClientDiscord;
    return res.json({
        name: client.user.tag,
        users: client.users.map(u => u.tag),
        channels: client.channels.map(c => c.name),
        guilds: client.guilds.map(g => g.name),
        readyAt: client.readyAt,
        uptime: client.uptime, 
        status: client.status
    })
})