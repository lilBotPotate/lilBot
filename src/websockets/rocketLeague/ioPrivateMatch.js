const {
    ServerSocket,
    Universal,
    Discord
} = require("../../imports/Imports");

module.exports = (io, app, path) => new ServerSocket(io, app, path)
.request.IO("getData", async function(data) {  
    if(!data) return this.sendError("Missing data");
    const { match, activeMatch, queue, filters } = data;

    if(!!match) this.socket.emit("match", await this.db.get("match") || {});
    if(!!activeMatch) this.socket.emit("activeMatch", await this.db.get("activeMatch") || {});
    if(!!queue) this.socket.emit("queue",  await this.db.get("queue") || []);
    if(!!filters) this.socket.emit("filters",  await this.db.get("filters") || []);
    Universal.sendLog("info", "getData");
})
.request.IO("setData", async function(data) {  
    if(!data) return this.sendError("Missing data");
    const { match, activeMatch, queue, filters } = data;

    if(typeof match === "object") { 
        await this.db.set("match", match);
        await this.io.emit("match", match); 
    }
    if(typeof activeMatch === "object") { 
        await this.db.set("activeMatch", activeMatch);
        await this.io.emit("activeMatch", activeMatch); 
    }
    if(typeof queue === "object") { 
        await this.db.set("queue", queue);
        await this.io.emit("queue", queue); 
    }
    if(typeof filters === "object") { 
        await this.db.set("filters", filters);
        await this.io.emit("filters", filters); 
    }
    Universal.sendLog("info", "setData");
})
.request.IO("deleteData", async function(data) {  
    if(!data) return this.sendError("Missing data");
    const { match, activeMatch, queue, filters } = data;

    if(typeof match === "object") { 
        await this.db.del("match");
        await this.io.emit("match", {}); 
    }
    if(typeof activeMatch === "object") { 
        await this.db.del("activeMatch");
        await this.io.emit("activeMatch", {}); 
    }
    if(typeof queue === "object") { 
        await this.db.del("queue");
        await this.io.emit("queue", []); 
    }
    if(typeof filters === "object") { 
        await this.db.del("filters");
        await this.io.emit("filters", []); 
    }
    Universal.sendLog("info", "deleteData");
})
.request.IO("createMatch", async function(data) {
    if(!data) return this.sendError("Missing data");
    let { username, password } = data;
    
    if(typeof username !== "string" || username.trim() == "") {
        return this.sendError("Missing username");
    }

    if((typeof password !== "string") || password.trim() === "") {
        password = Universal.generatePassword(5);
    }

    const match = { 
        username, password,
        timeCreated: new Date().toISOString()
    };

    await this.db.set("match", match);
    await this.io.emit("match", match); 
    Universal.sendLog("info", "createMatch");
})
.request.IO("joinQueue", async function(data) {
    if(!data) return this.sendError("Missing data");
    const { username, id, subscriber, moderator } = data;

    if(typeof username !== "string") return this.sendError("Missing username");
    if(isNaN(id)) return this.sendError("Missing id");
    if(typeof subscriber !== "boolean") return this.sendError("Missing subscriber");
    if(typeof moderator !== "boolean") return this.sendError("Missing moderator");

    const queue = await this.db.get("queue") || [];
    if(!queue) queue = [];
    if(queue.find(p => p.id == id)) return this.sendError(`${username} is already in the queue`);

    await queue.push({
        username, id, subscriber, moderator,
        timeJoined: new Date().toISOString()
    });

    await this.db.set("queue", queue);
    await this.io.emit("queue", queue);
    Universal.sendLog("info", "joinQueue");
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
.request.IO("newPassword", async function(data) {
    if(!data) return this.sendError("Missing data");
    let { password } = data;
    if((typeof password !== "string") || password.trim() === "") password = Universal.generatePassword(5);

    if(!this.db.has("match")) return this.sendError("No match");
    const match = await this.db.get("match");
    match.password = password;
    await this.db.set("match", match);
    await this.io.emit("match", match);
    Universal.sendLog("info", "newPassword");
})
.request.IO("startMatch", async function(data) {
    if(!this.db.has("match")) return this.sendError("No match");
    if(!this.db.has("queue")) return this.sendError("No queue");
    let { gamemode } = data;

    if(!isNaN(gamemode)) gamemode = parseInt(gamemode);
    else return this.sendError("Missing gamemode");

    const match = await this.db.get("match");
    const queue = await this.db.get("queue") || [];
    const filters = await this.db.get("filters") || [];

    if(typeof match.username !== "string") return this.sendError("Missing username");
    if(typeof match.password !== "string") return this.sendError("Missing password");

    const filteredQueue = queue.filter(p => {
        if(filters.includes("subscriber") && !p.subscriber) return false;
        if(filters.includes("moderator")  && !p.moderator) return false;
        return true;
    });

    const playersNeeded = gamemode * 2 - 1;

    if(filteredQueue.length < 1) return this.sendError("Empty queue");
    if(filteredQueue.length < playersNeeded) return this.sendError("Not enough participants");

    const players = filteredQueue.splice(0, playersNeeded);

    for(const player of players) {
        const index = await queue.findIndex(p => p.id == player.id);
        if(index !== -1) {
            await queue.splice(index, 1);
        }
    }
    
    const activeMatch = {
        username: match.username,
        password: match.password,
        gamemode,
        filters,
        players
    };

    await this.db.set("activeMatch", activeMatch);
    await this.io.emit("activeMatch", activeMatch);

    await this.db.set("queue", queue);
    await this.io.emit("queue", queue);

    const eMatch = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**lilPotate's ${gamemode}v${gamemode} private match**`)
        .setDescription("Join the lobby! <:lilpotHypebot:642086734774927363>")
        .addField("**Username**", match.username)
        .addField("**Password**", match.password);

    for(const p of players) {
        if(p.discord) {
            if(isNaN(p.id)) {
                this.sendError(`Could not send match info to ${p.username}`);
                continue;
            }
            try { await global.gClientDiscord.users.get(p.id).send(eMatch); } 
            catch (error) { 
                Universal.sendLog("error", `Failed to send match info to ${p.username} :\n${error}`); 
                this.sendError(`Failed to send match info to ${p.username}`);
            }
        }
        else if(p.twitch) {
            try {
                global.gClientTwitch.whisper(
                    p.username, 
                    `lilPotate's ${gamemode}v${gamemode} private match. Username: ${match.username}, Password: ${match.password}.`
                );
            } catch (error) {
                this.sendError(`Could not send match info to ${p.username}`);
            }
        }
    }
    Universal.sendLog("info", "startMatch");
})