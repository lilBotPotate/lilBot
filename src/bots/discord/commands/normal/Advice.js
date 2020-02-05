const {
    request
} = require("../../../../modules/Imports");

module.exports = {
    name: "ADVICE",
    description: {
        "info": "Life advice by lilBot",
        "uses": {
            "advice": "gives you adn advice",
            "advice {mention}": "gives that user an advice"
        }
    },
    execute(msg, args) {
        return sendAdvice(msg);
    }
};

async function sendAdvice(msg) {
    const jAdvice = await JSON.parse(await getJSON("https://api.adviceslip.com/advice"));
    const mention = msg.mentions.users.first();
    msg.channel.send(`${mention ? `${mention} ` : ""}${jAdvice.slip.advice}`);
}

function getJSON(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}