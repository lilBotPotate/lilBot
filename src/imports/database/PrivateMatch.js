const {
    jPrivateMatches
} = require("../functions/Stores");

const Universal = require("../functions/Universal");
const Discord = require("discord.js");

exports.getAll = async () => {
    const match = jPrivateMatches.has("match")
        ? await jPrivateMatches.get("match")
        : {};

    const participants = jPrivateMatches.has("participants")
        ? await jPrivateMatches.get("participants")
        : [];
        
    const players = jPrivateMatches.has("players")
        ? await jPrivateMatches.get("players")
        : [];
    
    const canJoin = jPrivateMatches.has("canJoin")
        ? await jPrivateMatches.get("canJoin")
        : false;

    return { match, participants, players, canJoin };
};

exports.getMatch = async () => {
    const match = jPrivateMatches.has("match")
        ? await jPrivateMatches.get("match")
        : {};

    return { match };
};

exports.getParticipants = async () => {
    const participants = jPrivateMatches.has("participants")
        ? await jPrivateMatches.get("participants")
        : [];

    return { participants };
};

exports.getPlayers = async () => {
    const players = jPrivateMatches.has("players")
        ? await jPrivateMatches.get("players")
        : [];

    return { players };
};

exports.getCanJoin = async () => {
    const canJoin = jPrivateMatches.has("canJoin")
        ? await jPrivateMatches.get("canJoin")
        : false;

    return { canJoin };
};

exports.createMatch = async (username, password, subsOnly, length) => { 
    if(!username && !jPrivateMatches.has("match")) return { error: "Missing username" };
    if(!username) username = await jPrivateMatches.get("match.username");   
    if(!password) password = Universal.generatePassword(length ? length : 5);
    if(subsOnly == undefined || (typeof subsOnly !== "boolean")) subsOnly = false;

    const match = { 
        username, password, subsOnly,
        timeCreated: new Date().toISOString()
    };

    await jPrivateMatches.set("match", match);
    await this.setCanJoin(true);
    Universal.sendLog("info", `New Private Match created! username: "${username}", password: "${password}", subsOnly: "${subsOnly}"`);
    return match;
};

exports.removeMatch = async () => {
    if(!jPrivateMatches.has("match")) return { error: "No active match" };
    jPrivateMatches.del("match");
    await Universal.sendLog("info", `Removed active Private Match!`);
    return {};
};

exports.setCanJoin = async (canJoin) => {
    if(canJoin == undefined) return { error: "Missing canJoin" };
    if(typeof canJoin !== "boolean") return { error: "Not boolean" };
    await jPrivateMatches.set("canJoin", canJoin);
    return { canJoin };
}

exports.joinMatch = async (username, id, isSub) => {
    const canJoin = jPrivateMatches.has("canJoin") 
        ? await jPrivateMatches.get("canJoin")
        : false;

    if(!canJoin) return { error: "Lobby is closed" };

    const match = await jPrivateMatches.get("match");
    if(!match) return { error: "No active match!" };

    if(!username) return { error: "Missing username" };
    if(!id) return { error: "Missing id" };
    if(isSub == undefined) return { error: "Missing isSub" };
    
    if(match.subsOnly && !isSub) return { error: "Private match is sub only" };

    const participants = jPrivateMatches.has("participants") ? await jPrivateMatches.get("participants") : [];
    if(participants.find(p => p.id == id)) return { error: `${username} is already in the queue` };
    const participant = { 
        username, id, isSub,
        timeJoined: new Date().toISOString()
    };
    participants.push(participant);
    await jPrivateMatches.set("participants", participants);

    await Universal.sendLog("info", `${username} joined the private match!`);
    return participant;
};

exports.leaveMatch = async (id) => {
    if(!id) return { error: "Missing id" };

    const participants = jPrivateMatches.has("participants") ? await jPrivateMatches.get("participants") : [];
    if(participants.length < 1) return { error: "Empty queue" };

    const index = participants.findIndex(p => p.id == id);
    if(index == -1) return { error: "Not in the queue" };
    const removedParticipant = participants.splice(index, 1);
    await jPrivateMatches.set("participants", participants);
    await Universal.sendLog("info", `${id} left the private match!`);
    return removedParticipant;
};

exports.setParticipants = async (newParticipants) => {
    if(typeof newParticipants !== "object") return { error: "participants is not an object" };
    for(const participant of newParticipants) {
        if(!participant.username) return { error: "Missing username" };
        if(!participant.id) return { error: "Missing id" };
        if(participant.isSub == undefined) return { error: "Missing isSub" };
    }
    await jPrivateMatches.set("participants", newParticipants);
    return newParticipants;
}

exports.updatePassword = async (newPassword, length) => {
    if(!jPrivateMatches.has("match")) return { error: "No active match!" };
    if(typeof length !== "number") return { error: "Wrong length type" };
    if(!newPassword) newPassword = Universal.generatePassword(length ? length : 5);
    
    const match = await jPrivateMatches.get("match");
    match.password = newPassword;
    await jPrivateMatches.set("match", match);
    return match;
}

exports.startMatch = async () => {
    const participants = await jPrivateMatches.get("participants");
    if(!participants || participants.length < 3) return { error: "Not enough participants" };
    const numPlayers = participants.length >= 5 ? 5 : 3;
    const players = participants.splice(0, numPlayers);
    await jPrivateMatches.set("players", players);
    await jPrivateMatches.set("participants", participants);
    this.sendToPlayers();
    return players;
}

exports.sendToPlayers = async () => {
    const { players } = await this.getPlayers();
    const { match } = await this.getMatch();

    if(!players || players.length < 1) return;
    if(!match || match == {}) return;
    const eMatch = new Discord.RichEmbed()
          .setColor("RANDOM")
          .setTitle("**lilPotate's private match**")
          .setDescription("Join the lobby! <:lilpotHypebot:642086734774927363>")
          .addField("**Username**", match.username)
          .addField("**Password**", match.password);

    for(const p of players) {
        try {
            await global.gClientDiscord.users.get(p.id).send(eMatch);
        } catch (error) { Universal.sendLog("error", `Failed to send to user :\n${error}`); }
    }

}