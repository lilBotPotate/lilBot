const Store = require("data-store");
const Universal = require("../functions/Universal");
const express = require("express");

module.exports = class {
    constructor(io, app, path) {
        if(!io) throw new Error("Missing io");
        if(!app) throw new Error("Missing app");
        if(!path) throw new Error("Missing path");

        this.path = path;
        this.io = io.of(path);

        this.ioRequests = new Map();
        this.db = new Store({ path: `${process.env.DB_STORAGE_PATH}/${path}.json`, indent: null });

        this.app = express.Router();
        app.use(`/${path}`, this.app);

        this.onConnection = this.onConnection.bind(this);
        this.addIORequest = this.addIORequest.bind(this);
        this.addAPIRequest = this.addAPIRequest.bind(this);

        this.io.on("connection", this.onConnection);

        this.request = {
            IO: this.addIORequest,
            API: {
                ALL: (name, fun) => this.addAPIRequest("all", name, fun),
                GET: (name, fun) => this.addAPIRequest("get", name, fun),
                POST: (name, fun) => this.addAPIRequest("post", name, fun),
                PUT: (name, fun) => this.addAPIRequest("put", name, fun),
                DELETE: (name, fun) => this.addAPIRequest("delete", name, fun)
            }
        };
    }

    onConnection(socket) {
        Universal.sendLog("info", `${this.path} >> ${socket.handshake.address} > CONNECTED`);
        const binder = { 
            ...this, 
            socket,
            sendError: (error) => socket.emit("reqError", { error })
        };
        this.ioRequests.forEach((value, key) => socket.on(key, value.bind(binder)));
    }

    addIORequest(name, fun) {
        if(!name) throw new Error("Missing name");
        if(!fun) throw new Error("Missing fun");
        this.ioRequests.set(name, fun);
        return this;
    }

    addAPIRequest(type, path, fun) {
        if(!type) throw new Error("Missing type");
        if(!path) throw new Error("Missing path");
        if(!fun) throw new Error("Missing fun");
        this.app[type](path, fun.bind(this));
        return this;
    }
}