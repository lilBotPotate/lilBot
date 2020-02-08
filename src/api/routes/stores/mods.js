const {
    jMods
} = require("../../../imports/functions/Stores");

const {
    express
} = require("../../../imports/Imports");
const router = express.Router();

router.get('/', async function(req, res, next) {
    res.json(jMods.get("mods"));
});

module.exports = router;
