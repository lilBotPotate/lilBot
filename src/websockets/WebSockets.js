const {
    Universal
} = require("../imports/Imports");
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = require('http').Server(app);
const io = require('socket.io')(server);


server.listen(7777);

io.use((socket, next) => {
    Universal.sendLog("info", `MAIN SOCKET >> ${socket.handshake.address} > CONNECTED`);
    return next();
    // let token = socket.handshake.query.token;
    // if (isValid(token)) {
    //   return next();
    // }
    // return next(new Error('authentication error'));
})

app.use((req, res, next) => {
    Universal.sendLog("info", `API REQUEST >> ${req.ip}`);
    return next();
})

const rocketLeague = {
    ioPrivateMatch: require("./rocketLeague/ioPrivateMatch")(io, app, "rl/privateMatch"),
    ioTournament: require("./rocketLeague/ioTournament")(io, app, "rl/tournament")
};

const discord = {
    ioBotStatus: require("./discord/ioBotStatus")(io, app, "discord/botStatus"),
};

const twitch = {
    ioPoll: require("./twitch/ioPoll")(io, app, "twitch/poll"),
    ioContest: require("./twitch/ioContest")(io, app, "twitch/contest")
};

const misc = {

};

module.exports = {
    ...rocketLeague,
    ...discord,
    ...twitch,
    ...misc
}