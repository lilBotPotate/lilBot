const {
    Discord
} = require("../../../../modules/Imports");

const {
    jMods
} = require("../../../../modules/Stores");

module.exports = {
    name: "MODPOINTS",
    description: {
        "info": "Give some points to the good mods!",
        "uses": {
            "modpoints": "list all mods with their points",
            "modpoints {tag} {+,-,*,/}{points}": "modify points of the mod"
        }
    },
    execute(msg, args) {
        switch(args.length) {
            case 2: return modifyPoints({msg, args});
            default: return listMods({msg});
        }
    }
};

function modifyPoints({msg, args}) {
    if(!global.gConfig.disord_admins.find(id => id == msg.author.id)) {
        return msg.channel.send("You don't have permission to use this command!");
    }
    const mentionedUser = msg.mentions.users.first();
    if(!mentionedUser) return msg.channel.send("You have to mention a user!");
    const rawPoints = args[1];
    const pointsOperator = rawPoints.charAt(0);
    const pointsString = rawPoints.substring(1);
    for(const i of pointsString) {
        if(isNaN(i)) return msg.channel.send("Invalid points format!")
    }
    const points = parseInt(pointsString);
    const pointsFunction = ({
        "+": (a) => a + points,
        "-": (a) => a - points,
        "*": (a) => a * points,
        "/": (a) => {
            if(points == 0) return a;
            return a / points;
        }
    })[pointsOperator];

    let modArr = jMods.get("mods");
    if(!modArr) modArr = [];

    let hasMod = false;
    let modPoints = 0;
    modArr = modArr.map(mod => {
        if(mod.id !== mentionedUser.id) return mod;
        hasMod = true;
        mod.name = mentionedUser.username;
        mod.points = pointsFunction(mod.points);
        modPoints = mod.points;
        return mod;
    });

    if(!hasMod) {
        const newMod = {
            id: mentionedUser.id,
            name: mentionedUser.username,
            points: pointsFunction(0)
        };
        modPoints = newMod.points;
        modArr.push(newMod);
    }

    jMods.set("mods", modArr);
    return msg.channel.send(`**${mentionedUser.username}** has **${modPoints}** points now!`);
}

function listMods({msg}) {
    const modArr = jMods.get("mods");
    if(!modArr || modArr.length < 1) return msg.channel.send("No data has been stored yet!");
    const pointsArr = modArr
                    .sort((a, b) => b.points - a.points)
                    .map((mod, i) => {
                        const placeEmojis = {
                            1: ":first_place:",
                            2: ":second_place:",
                            3: ":third_place:"
                        };
                        const emoji = placeEmojis[i + 1];
                        return `**${emoji ? emoji : `${i + 1}.`} ${mod.name}:** ${mod.points} points`;
                    });
    
    const eMods = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("**MOD POINTS**")
        .setDescription(pointsArr.join("\n"));

    return msg.channel.send(eMods);
}   