const {
    express,
    Route,
    Database
} = require("../../../imports/Imports");
const router = express.Router();

Route.GET(router, "/", async ({ res }) => {
    const data = await Database.PrivateMatch.getAll();
    return await res.json(data);
});

Route.GET(router, "/getMatch", async ({ res }) => {
    const match = await Database.PrivateMatch.getMatch();
    return await res.json(match);
});

Route.GET(router, "/getParticipants", async ({ res }) => {
    const participants = await Database.PrivateMatch.getParticipants();
    return await res.json(participants);
});

Route.GET(router, "/getCanJoin", async ({ res }) => {
    const canJoin = await Database.PrivateMatch.getCanJoin();
    return await res.json(canJoin);
});

Route.GET(router, "/startMatch", async ({ res }) => {
    const players = await Database.PrivateMatch.startMatch();
    return await res.json(players);
});

Route.POST(router, "/createMatch", async ({ req, res }) => {
    const { username, password, subsOnly, length } = req.body;
    const match = await Database.PrivateMatch.createMatch(username, password, subsOnly, length);
    if(match.error) return res.status(400).send(match.error);
    return await res.status(200).json(match);
});

Route.POST(router, "/joinMatch", async ({ req, res }) => {
    const { username, id, isSub } = req.body;
    const participant = await Database.PrivateMatch.joinMatch(username, id, isSub);
    if(participant.error) return res.status(400).send(participant.error);
    return await res.status(200).json(participant);
});

Route.POST(router, "/setParticipants", async ({ req, res }) => {
    const { participants } = req.body;
    const participantsNew = await Database.PrivateMatch.setParticipants(participants);
    if(participantsNew.error) return res.status(400).send(participantsNew.error);
    return await res.status(200).json(participantsNew);
});

Route.POST(router, "/setCanJoin", async ({ req, res }) => {
    const { canJoin } = req.body;
    const canJoinNew = await Database.PrivateMatch.setCanJoin(canJoin);
    if(canJoinNew.error) return res.status(400).send(canJoinNew.error);
    return await res.status(200).json({ canJoin: canJoinNew });
});

Route.POST(router, "/updatePassword", async ({ req, res }) => {
    const { password, length } = req.body;
    const match = await Database.PrivateMatch.updatePassword(password, length);
    if(match.error) return res.status(400).send(match.error);
    return await res.status(200).json(match);
});

Route.DELETE(router, "/removeMatch", async ({ res }) => {
    const match = await Database.PrivateMatch.removeMatch();
    if(match.error) return res.status(400).send(match.error);
    return await res.status(200).json(match);
});

Route.DELETE(router, "/leaveMatch", async ({ req, res }) => {
    const { id } = req.body;
    const participant = await Database.PrivateMatch.leaveMatch(id);
    if(participant.error) return res.status(400).send(participant.error);
    return await res.status(200).json(participant);
});

module.exports = router;
