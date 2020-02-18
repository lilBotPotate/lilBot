const {
    ServerSocket,
    Universal,
    Discord
} = require("../Imports");

exports.wsPrivateMatch = new ServerSocket("private_match", global.gConfig.ports.private_match)
    .setRequest("getData", async function ({ data }) { 
        if(!data.get) return this.sendError("Missing get");
        const { match, queue, players, canJoin } = data.get;

        const response = {};
        if(match) response.match = await this.getData("match");
        if(queue) response.queue = await this.getData("queue");
        if(players) response.players = await this.getData("players");
        if(canJoin) response.canJoin = await this.getData("canJoin");

        return this.respond(response);
    })
    .setRequest("setData", async function ({ data }) { 
        if(!data.set) return this.sendError("Missing set");
        const { match, queue, players, canJoin } = data.set;

        const response = {};
        if(match) response.match = await this.setData("match", match);
        if(queue) response.queue = await this.setData("queue", queue);
        if(players) response.players = await this.setData("players", players);
        if(canJoin) response.canJoin = await this.setData("canJoin", canJoin);
    })
    .setRequest("deleteData", async function ({ data }) { 
        if(!data.delete) return this.sendError("Missing delete");
        const { match, queue, players, canJoin } = data.delete;

        const response = {};
        if(match) response.match = await this.deleteData("match");
        if(queue) response.queue = await this.deleteData("queue");
        if(players) response.players = await this.deleteData("players");
        if(canJoin) response.canJoin = await this.deleteData("canJoin");
    })
    .setRequest("createMatch", async function ({ data }) { 
        const { username, password, subsOnly, length } = data;

        if(!username) {
            if(!this.hasData("match")) return this.sendError("Missing username");
            username = await this.getData("match.username");
        }
        if(!length || (typeof length !== "number")) length = 5;
        if(!password) password = Universal.generatePassword(length);
        if(subsOnly == undefined || (typeof subsOnly !== "boolean")) subsOnly = false;

        const match = { 
            username, password, subsOnly,
            timeCreated: new Date().toISOString()
        };

        await this.setData("match", match);
        await this.setData("canJoin", true);
        return Universal.sendLog("info", `New Private Match created! username: "${username}", password: "${password}", subsOnly: "${subsOnly}"`);
    })
    .setRequest("joinQueue", async function ({ data }) { 
        const { username, id, isSub } = data;

        if(!username) return this.sendError("Missing username");
        if(!id) return this.sendError("Missing id");
        if(isSub == undefined || (typeof isSub !== "boolean")) isSub = false;

        const queue = await this.hasData("queue") ? await this.getData("queue") : [];
        if(queue.find(p => p.id == id)) return this.sendError(`${username} is already in the queue`);

        await queue.push({
            username, id, isSub,
            timeJoined: new Date().toISOString()
        });

        await this.setData("queue", queue);
    })
    .setRequest("leaveQueue", async function ({ data }) { 
        const { id } = data;

        if(!id) return this.sendError("Missing id");

        const queue = await this.hasData("queue") ? await this.getData("queue") : [];
        if(queue.length < 1) return this.setData("queue", []);

        const index = queue.findIndex(p => p.id == id);
        if(index == -1) return this.sendError("Participant is not in the queue");
        await queue.splice(index, 1);
        await this.setData("queue", queue);
    })
    .setRequest("newPassword", async function ({ data }) { 
        const { password, length } = data;

        if(!length || (typeof length !== "number")) length = 5;
        if(!password) password = Universal.generatePassword(length);

        if(!this.hasData("match")) return this.sendError("No active match");
        const match = await this.getData("match");
        match.password = password;
        await this.setData("match", match);
    })
    .setRequest("startMatch", async function () { 
        if(!this.hasData("match")) return this.sendError("No active match");

        const match = await this.getData("match");
        const queue = await this.hasData("queue") ? await this.getData("queue") : [];

        if(queue.length < 1) return this.sendError("Empty queue");
        if(queue.length < 3) return this.sendError("Not enough participants");

        const participantsCount = queue.length >= 5 ? 5 : 3;
        const players = queue.splice(0, participantsCount);

        await this.setData("players", players);
        await this.setData("queue", queue);

        const eMatch = new Discord.RichEmbed()
              .setColor("RANDOM")
              .setTitle("**lilPotate's private match**")
              .setDescription("Join the lobby! <:lilpotHypebot:642086734774927363>")
              .addField("**Username**", match.username)
              .addField("**Password**", match.password);
    
        for(const p of players) {
            try { await global.gClientDiscord.users.get(p.id).send(eMatch); } 
            catch (error) { Universal.sendLog("error", `Failed to send to user :\n${error}`); }
        }
    })
    .setRequest("error", function () { 
        return this.sendError("Example errorrrrss");
    })

    