const {
    Universal,
    Store,
    Discord
} = require("../Imports");

const io = require("socket.io")(process.env.WEBSOCKET_PORT);

io.use(async (socket, next) => {
    console.log("connected main");
    
    return next();
    // let username = socket.handshake.query.username;
    // let password = socket.handshake.query.password;

    // console.log({ username, password });

    // if (password == "123") {
    //     return next();
    // }
    // return next(new Error("Wrong password"));
});

exports.ioPrivateMatch = io.of("private-match").on("connect", function (socket) {
    Universal.sendLog("info", `${this.name} >> ${socket.handshake.address} > CONNECTED`);

    this.db = new Store({ path: `${process.env.DB_STORAGE_PATH}${this.name}.json`, indent: null });

    this.req = {};

    this.req.getData = async ({ match, activeMatch, queue, canJoin }) => {
        if(match) socket.emit("match", await this.db.get("match") || {});
        if(activeMatch) socket.emit("activeMatch", await this.db.get("activeMatch") || {});
        if(queue) socket.emit("queue", await this.db.get("queue") || []);
        if(canJoin) socket.emit("canJoin", await this.db.get("canJoin") || false);
    };

    this.req.setData = async ({ match, activeMatch, queue, canJoin }) => {
        if(checkType(match, "object")) { 
            await this.db.set("match", match);
            await this.emit("match", match); 
        }
        if(checkType(activeMatch, "object")) { 
            await this.db.set("activeMatch", activeMatch);
            await this.emit("activeMatch", activeMatch); 
        }
        if(checkType(queue, "object")) { 
            await this.db.set("queue", queue);
            await this.emit("queue", queue); 
        }
        if(checkType(canJoin, "boolean")) { 
            await this.db.set("canJoin", canJoin);
            await this.emit("canJoin", canJoin); 
        }
    };

    this.req.deleteData = async ({ match, activeMatch, queue, canJoin }) => {
        if(match) { 
            await this.db.del("match");
            await this.emit("match", {}); 
        }
        if(activeMatch) { 
            await this.db.del("activeMatch");
            await this.emit("activeMatch", {}); 
        }
        if(queue) { 
            await this.db.del("queue");
            await this.emit("queue", []); 
        }
        if(canJoin) { 
            await this.db.del("canJoin");
            await this.emit("canJoin", false); 
        }
    };

    this.req.createMatch = async ({ username, password, subsOnly, passLength }) => {
        if(!checkType(username, "string")) {
            if(!this.db.has("match")) return sendError("Missing username");
            username = await this.db.get("match.username");
        }
        if(!checkType(passLength, "number")) passLength = 5;
        if(!checkType(password, "string")  || password.trim() === "") password = Universal.generatePassword(passLength);
        if(!checkType(subsOnly, "boolean")) subsOnly = false;
        
        const match = { 
            username, password, subsOnly,
            timeCreated: new Date().toISOString()
        };

        await this.db.set("match", match);
        await this.emit("match", match); 

        await this.db.set("canJoin", true);
        await this.emit("canJoin", true); 
    };

    this.req.joinQueue = async ({ username, id, isSub }) => {
        if(!checkType(username, "string")) return sendError("Missing username");
        if(!checkType(id, "string") && !checkType(id, "number")) return sendError("Missing id");
        if(!checkType(isSub, "boolean")) isSub = false;

        const queue = await this.db.get("queue") || [];

        if(queue.find(p => p.id == id)) return sendError(`${username} is already in the queue`);

        await queue.push({
            username, id, isSub,
            timeJoined: new Date().toISOString()
        });

        await this.db.set("queue", queue);
        await this.emit("queue", queue);
    }

    this.req.leaveQueue = async ({ id }) => {
        if(!checkType(id, "string") && !checkType(id, "number")) return sendError("Missing id");

        const queue = await this.db.get("queue") || [];
        const index = await queue.findIndex(p => p.id == id);
        if(index == -1) return sendError("Participant is not in the queue");
        await queue.splice(index, 1);
        await this.db.set("queue", queue);
        await this.emit("queue", queue);
    }

    this.req.newPassword = async ({ password, passLength }) => {
        if(!checkType(passLength, "number")) passLength = 5;
        if(!checkType(password, "string") || password === "") password = Universal.generatePassword(passLength);

        if(!this.db.has("match")) return sendError("No match");
        const match = await this.db.get("match");
        match.password = password;
        await this.db.set("match", match);
        await this.emit("match", match);
    }

    this.req.startMatch = async () => {
        if(!this.db.has("match")) return sendError("No match");

        const match = await this.db.get("match");
        const queue = await this.db.get("queue") || [];

        if(queue.length < 1) return sendError("Empty queue");
        if(queue.length < 3) return sendError("Not enough participants");

        const participantsCount = queue.length >= 5 ? 5 : 3;
        const players = queue.splice(0, participantsCount);

        const activeMatch = match;
        activeMatch.players = players;

        await this.db.set("activeMatch", activeMatch);
        await this.emit("activeMatch", activeMatch);

        await this.db.set("queue", queue);
        await this.emit("queue", queue);

        const eMatch = new Discord.RichEmbed()
              .setColor("RANDOM")
              .setTitle("**lilPotate's private match**")
              .setDescription("Join the lobby! <:lilpotHypebot:642086734774927363>")
              .addField("**Username**", match.username)
              .addField("**Password**", match.password);
    
        for(const p of players) {
            if(!checkType(p.id, "string") && !checkType(p.id, "number")) continue;
            try { await global.gClientDiscord.users.get(p.id).send(eMatch); } 
            catch (error) { 
                Universal.sendLog("error", `Failed to send match info to ${p.username} :\n${error}`); 
                sendError(`Failed to send match info to ${p.username}`);
            }
        }
    }

    socket.on("getData", this.req.getData);
    socket.on("setData", this.req.setData);
    socket.on("deleteData", this.req.deleteData);
    socket.on("createMatch", this.req.createMatch);
    socket.on("joinQueue", this.req.joinQueue);
    socket.on("leaveQueue", this.req.leaveQueue);
    socket.on("newPassword", this.req.newPassword);
    socket.on("startMatch", this.req.startMatch);

    function sendError(message) { 
        if(socket) return socket.emit("reqError", { error: message }); 
        return { error: message };
    }
});
      
exports.ioTournament = io.of("tournament").on("connect", function (socket) {
    Universal.sendLog("info", `${this.name} >> ${socket.handshake.address} > CONNECTED`);

    this.db = new Store({ path: `${process.env.DB_STORAGE_PATH}${this.name}.json`, indent: null });

    this.req = {};

    this.req.getTournament = async () => {
        socket.emit("tournament", await this.db.get("tournament") || {});
    };

    this.req.createTournament = async ({ name, password, subsOnly, isOpen, passLength }) => {
        if(!checkType(name, "string")) 
        if(!checkType(passLength, "number")) passLength = 5;
        if(!checkType(password, "string") || password.trim() === "") {
            const newPass = Universal.generatePassword(5);
            password = newPass;
        }
        if(!checkType(subsOnly, "boolean")) subsOnly = false;
        if(!checkType(isOpen, "boolean")) isOpen = false;
        
        const tournament = { 
            name, password, subsOnly, isOpen,
            timeCreated: new Date().toISOString()
        };

        await this.db.set("tournament", tournament);
        await this.emit("tournament", tournament); 
    };

    this.req.deleteTournament = async () => {
        await this.db.set("tournament", {});
        await this.emit("tournament", {}); 
    };

    this.req.changeIsOpen = async (isOpen) => {
        const tournament = await this.db.get("tournament") || {};
        if(!tournament || tournament == {}) return sendError("No tournament");
        if(checkType(isOpen, "boolean")) {
            tournament.isOpen = isOpen;
        } else {
            tournament.isOpen = !tournament.isOpen;
        }

        await this.db.set("tournament", tournament);
        await this.emit("tournament", tournament); 
    };

    socket.on("getTournament", this.req.getTournament);
    socket.on("createTournament", this.req.createTournament);
    socket.on("deleteTournament", this.req.deleteTournament);
    socket.on("changeIsOpen", this.req.changeIsOpen);

    function sendError(message) { 
        if(socket) return socket.emit("reqError", { error: message }); 
        return { error: message };
    }
});

exports.ioPrivateMatch = io.of("1v1").on("connect", function (socket) {
    Universal.sendLog("info", `${this.name} >> ${socket.handshake.address} > CONNECTED`);

    this.db = new Store({ path: `${process.env.DB_STORAGE_PATH}${this.name}.json`, indent: null });

    this.req = {};

    this.req.getData = async ({ match, activeMatch, queue, canJoin }) => {
        if(match) socket.emit("match", await this.db.get("match") || {});
        if(activeMatch) socket.emit("activeMatch", await this.db.get("activeMatch") || {});
        if(queue) socket.emit("queue", await this.db.get("queue") || []);
        if(canJoin) socket.emit("canJoin", await this.db.get("canJoin") || false);
    };

    socket.on("getData", this.req.getData);

    function sendError(message) { 
        if(socket) return socket.emit("reqError", { error: message }); 
        return { error: message };
    }
});

function checkType(par, type) {
    return typeof par === type;
}