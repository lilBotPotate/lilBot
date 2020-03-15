const {
    ServerSocket,
    Universal,
    Discord
} = require("../../imports/Imports");

module.exports = (io, app, path) => new ServerSocket(io, app, path)
.request.IO("getTournament", async function() {  
    const name = this.db.get("name") || null;
    const password = this.db.get("password") || null;
    const filters = this.db.get("filters") || [];

    this.socket.emit("tournament",  {
        name, password, filters
    });
    Universal.sendLog("info", "getTournament");
})
.request.IO("createTournament", async function(data) {  
    let { name, password, filters } = data;
    
    if(!name) return this.sendError("Missing name");
    if((typeof password !== "string") || password.trim() === "") {
        password = Universal.generatePassword(5);
    }
    if(typeof filters !== "object") return this.sendError("Missing filters");

    this.db.set("name", name);
    this.db.set("password", password);
    this.db.set("filters", filters);

    this.io.emit("tournament",  {
        name, password, filters
    });
    Universal.sendLog("info", "createTournament");
})
.request.IO("deleteTournament", async function() {  
    this.db.del("name");
    this.db.del("password");
    this.db.set("filters", []);

    this.io.emit("tournament",  {});
    Universal.sendLog("info", "deleteTournament");
})
