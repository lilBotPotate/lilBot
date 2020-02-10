const {
    jTournaments
} = require("../../../imports/functions/Stores");

const {
    express,
    Route,
    Universal   
} = require("../../../imports/Imports");
const router = express.Router();

/* -------------------- ROUTES -------------------- */

Route.GET(router, "/", root);
Route.GET(router, "/active", active);
Route.GET(router, "/past", past);
Route.POST(router, "/create", create);
Route.DELETE(router, "/remove", remove);

/* -------------------- FUNCTIONS -------------------- */

async function root({ res }) {
    const active = jTournaments.has("active")
                 ? await jTournaments.get("active")
                 : {};

    const past = jTournaments.has("past")
               ? await jTournaments.get("past")
               : [];

    return res.json({ active, past });
}

async function active({ res }) {
    const active = jTournaments.has("active")
                 ? await jTournaments.get("active")
                 : {};

    return res.json({ active });
}

async function past({ res }) {
    const past = jTournaments.has("past")
               ? await jTournaments.get("past")
               : [];

    return res.json({ past });
}

async function create({ req, res }) {
    const { name, password, subsOnly } = req.body;
    if(!name) return res.status(400).send("Missing name");
    if(!password) return res.status(400).send("Missing password");
    if(!subsOnly) return res.status(400).send("Missing subsOnly");
    
    const newTournament = { 
        name, password, subsOnly,
        timeCreated: new Date().toISOString()
    };
    const active = await jTournaments.get("active");
    const past = jTournaments.has("past") ? await jTournaments.get("past") : [];
    if(active) {
        await past.push(active);
        await jTournaments.set("past", past);
    } 
    await jTournaments.set("active", newTournament);
    Universal.sendLog("info", `New tournament created! name: "${name}", password: "${password}", subsOnly: "${subsOnly}"`);
    return await res.status(200).json(newTournament);
}

async function remove({ res }) {
    if(!jTournaments.has("active")) return await res.status(200).json({ removed: false });
    jTournaments.del("active");
    Universal.sendLog("info", `Removed active tournament!`);
    return await res.status(200).json({ removed: true });
}

module.exports = router;
