const Store = require("data-store");
const WebSocket = require("ws");
const Universal = require("../functions/Universal");

module.exports = class {
    constructor(name, port) {
        if(!name) throw new Error("Missing name!");
        if(!port) throw new Error("Missing port!");

        this.name = name;
        this.port = port;
        this.db = new Store({ path: `${process.env.DB_STORAGE_PATH}${name}.json`, indent: null });
        this.server = new WebSocket.Server({ port });
        this.requests = new Map();

        this.onConnection = this.onConnection.bind(this);
        this.onMessage = this.onMessage.bind(this);

        this.server.on("connection", this.onConnection);
    }

    onConnection(ws) {
        Universal.sendLog("info", `${this.name} >> ${ws._socket.remoteAddress} > CONNECTED`);

        ws.on("close", () => Universal.sendLog("info", `${this.name} >> ${ws._socket.remoteAddress} > DISCONNECTED`));
        ws.on("message", (data) => this.onMessage(ws, data));
    }

    onMessage(ws, data) {
        try { data = JSON.parse(data); }
        catch (error) { return Universal.sendLog("warn", `${this.name} >> ${ws._socket.remoteAddress} > DATA IS NOT JSON`); }

        if(!data.request) return Universal.sendLog("warn", `${this.name} >> ${ws._socket.remoteAddress} > MISSING REQUEST NAME`);

        const requestName = data.request.toUpperCase();
        if(!this.requests.has(requestName)) return Universal.sendLog("warn", `${this.name} >> ${ws._socket.remoteAddress} > REQUEST DOESN'T EXIST: ${requestName}`);

        const binder = this;
        binder.client = ws;
        binder.respond = (d) => ws.send(JSON.stringify({ [this.name]: d }));
        binder.sendError = (d) => ws.send(JSON.stringify({ error: d }));

        const reqFun = this.requests.get(requestName).bind(binder);
        return reqFun(data);
    }

    broadcast(data) {
        return this.server.clients.forEach((client) => client.send(JSON.stringify(data)));
    }

    setRequest(name, fun) {
        if(typeof fun !== "function") throw new Error("Request function is not a function!");
        this.requests.set(name.toUpperCase(), fun);
        return this;
    }

    async getData(path) {
        if(!this.db.has(`${this.name}.${path}`)) return null;
        return this.db.get(`${this.name}.${path}`);
    }

    hasData(path) {
        return this.db.has(`${this.name}.${path}`);
    }

    async setData(path, data) {
        await this.db.set(`${this.name}.${path}`, data);
        const updatedData = await this.db.get(`${this.name}.${await path.split(".")[0]}`);
        if(!updatedData) return Universal.sendLog("warn", `${this.name} > Failed to update data`);
        this.broadcast(updatedData);
        return updatedData;
    }

    async deleteData(path) {
        this.db.del(`${this.name}.${path}`);
        const response = { [this.name]: {} };
        response[this.name][await path.split(".")[0]] = {};
        return this.broadcast(response);
    }
}