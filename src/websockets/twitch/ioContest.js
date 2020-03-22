const {
    ServerSocket,
    Universal,
    Discord
} = require("../../imports/Imports");

module.exports = (io, app, path) => new ServerSocket(io, app, path)
.request.IO("getData", async function(data) {  
    if(!data) return this.sendError("Missing data");
    const { messages, winner, queue, filters } = data;

    if(!!messages) this.socket.emit("messages", await this.db.get("messages") || []);
    if(!!winner) this.socket.emit("winner", await this.db.get("winner") || {});
    if(!!queue) this.socket.emit("queue",  await this.db.get("queue") || []);
    if(!!filters) this.socket.emit("filters",  await this.db.get("filters") || []);
    Universal.sendLog("info", "getData");
})
.request.IO("setData", async function(data) {  
    if(!data) return this.sendError("Missing data");
    const { messages, winner, queue, filters } = data;

    if(Array.isArray(messages)) { 
        await this.db.set("messages", messages);
        await this.io.emit("messages", messages); 
    }
    if(typeof winner === "object") { 
        await this.db.set("winner", winner);
        await this.io.emit("winner", winner); 
    }
    if(Array.isArray(queue)) { 
        await this.db.set("queue", queue);
        await this.io.emit("queue", queue); 
    }
    if(Array.isArray(filters)) { 
        await this.db.set("filters", filters);
        await this.io.emit("filters", filters); 
    }
    Universal.sendLog("info", "setData");
})
.request.IO("leaveQueue", async function(data) {
    if(!data) return this.sendError("Missing data");
    const { id } = data;

    if((typeof id !== "string") && typeof id !== "number") return this.sendError("Missing id");

    const queue = await this.db.get("queue") || [];
    if(!queue) queue = [];
    const index = await queue.findIndex(p => p.id == id);
    if(index == -1) return this.sendError("Participant is not in the queue");
    await queue.splice(index, 1);

    await this.db.set("queue", queue);
    await this.io.emit("queue", queue);
    Universal.sendLog("info", "leaveQueue");
})
.request.IO("drawWinner", async function() {  
    Universal.sendLog("info", "drawWinner");
    const queue = await this.db.get("queue") || [];
    const filters = await this.db.get("filters") || [];

    const filteredQueue = queue.filter(p => {
        for(const f of filters) if(!p[f]) return false;
        return true;
    });

    if(filteredQueue.length < 1) return this.sendError("Empty queue");
    const winner = filteredQueue.splice(Math.floor(Math.random() * filteredQueue.length), 1)[0];
    const index = await queue.findIndex(p => p.id == winner.id);
    if(index !== -1) await queue.splice(index, 1);

    this.db.set("queue", queue);
    this.io.emit("queue", queue);

    this.db.set("messages", []);
    this.io.emit("messages", []);

    this.db.set("winner", winner);
    this.io.emit("winner", winner);
})