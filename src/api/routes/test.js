const {
    Universal,
    express
} = require("../../imports/Imports");
const router = express.Router();

/* GET home page. */
router.get('/config', async function(req, res, next) {
    return Universal.checkPassword(req.headers.password).then((isValid) => {
        if(!isValid) return res.status(500).send("Wrong password");
        return res.send(global.gConfig);
    });
});

module.exports = router;
