const {
    ServerSocket,
    Universal,
    Discord
} = require("../../imports/Imports");

module.exports = (io, app, path) => new ServerSocket(io, app, path)
.request.IO("getPoll", async function() {  
    Universal.sendLog("info", "getPoll");
    const poll = this.db.get("poll") || {};
    await this.socket.emit("poll", poll);
})
.request.IO("createPoll", async function(data) {
    Universal.sendLog("info", "createPoll");
    const { name, options } = data;
    if(typeof name !== "string") return this.sendError("Missing name");
    if(!Array.isArray(options)) return this.sendError("Missing options");

    const poll = {
        name, 
        votes: 0,
        options: options.map((pi, i) => {
            return { id: (i + 1), name: pi, votes: 0 }
        })
    };
    await this.db.set("poll", poll);
    await this.db.set("voters", {});
    await this.io.emit("poll", poll);
});