const {
    Discord
} = require("../../../Imports.js");

const {
    jMods
} = require("../../../Stores.js");

module.exports = {
    name: "MODPOINTS",
    description: {
        "info": "Give some points to the good mods!",
        "uses": {
            "modpoints {tag} {+,-,*,/}{points}": "modify points of the mod"
        }
    },
    execute(msg, args) {
        if(
            msg.author.id !== "237509022301814784" &&
            !msg.guild.fetchMember(msg.author).roles.has(global.gConfig.owner_role)
        ) { return msg.channel.send("You don't have permission to use this command!"); }
        if(args && args.length < 1) return msg.channel.send("Missing arguments");
        const command = args.shift().toUpperCase();
        switch(command) {
            case "LIST": return listMods({msg});
            default: return modifyPoints({msg, args});
        }
    }
};

function modifyPoints({msg, args}) {
    if(args && args.length < 1) return msg.channel.send("Missing arguments");
    const mentionedUser = msg.mentions.users.first();
    if(!mentionedUser) return msg.channel.send("You have to mention a user!");
    const rawPoints = args.shift();
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
    const pointsArr = modArr.sort((a, b) => b.points - a.points)
                            .map((mod, i) => {
                                const placeEmojis = {
                                    1: ":first_place:",
                                    2: ":second_place:",
                                    3: ":third_place:"
                                }
                                const emoji = placeEmojis[i + 1];
                                return `**${emoji ? emoji : `${i + 1}.`} ${mod.name}:** ${mod.points} points`;
                            });
    
    const eMods = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("**MOD POINTS**")
        .setDescription(pointsArr.join("\n"));

    return msg.channel.send(eMods);
}   