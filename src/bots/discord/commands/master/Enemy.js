const {
    Discord,
    Command,
    Universal
} = require("../../../../imports/Imports");

const {
    jEnemys
} = require("../../../../imports/functions/Stores");

module.exports = new Command.Master()
      .setName("ENEMY")
      .setInfo("Byeee!")
      .addUse("enemy add {tag}", "ban that user from using the bot")
      .addSubCommand("ADD", add)
      .addSubCommand("REMOVE", remove)
      .addSubCommand("LIST", list);

function add(msg) {
    const { 
        mentionedUser, 
        enemies, 
        hasUser 
    } = getEnemiesAndUser(msg);
    if(!mentionedUser) return Universal.sendTemporary(msg, "You need to tag someone!");
    if(hasUser) return msg.channel.send("That user is already on the list!");
    enemies.push(mentionedUser.id);
    jEnemys.set("enemies", enemies);
    return sendUserToChat({ msg, mentionedUser, action: "NOT ALLOWED" });
}

function remove(msg) {
    const { 
        mentionedUser, 
        enemies, 
        hasUser 
    } = getEnemiesAndUser(msg);
    if(!mentionedUser) return Universal.sendTemporary(msg, "You need to tag someone!");
    if(!hasUser) return msg.channel.send("That user is not on the list!");
    const newEnemies = enemies.filter(userId => userId !== mentionedUser.id);
    jEnemys.set("enemies", newEnemies);
    return sendUserToChat({ msg, mentionedUser, action: "ALLOWED" });
}

async function list(msg) {
    let enemies = jEnemys.get("enemies");
    if(!enemies || enemies.length < 1) return msg.channel.send("The bot has no enemies");
    const client = global.gClientDiscord;
    const enemiesNames = await getEnemyNames(enemies);

    const eEnemies = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**BOTS ENEMIES**`)
        .setDescription(`**${enemiesNames.join("**, **")}**`);

    return await msg.channel.send(eEnemies);
    function getEnemyNames(enemies) {
        return Promise.all(
            enemies.map(async userId => {
                const user = await getUser(userId);
                return `${user.username}#${user.discriminator}`;
            }).sort()
        )
    }
    async function getUser(userId) { return client.fetchUser(userId); }
}

/* --------------- METHODS --------------- */
function initEnemies() {
    jEnemys.set("enemies", []);
    return [];
}

function getEnemiesAndUser(msg) {
    const mentionedUser = msg.mentions.users.first();
    let enemies = jEnemys.get("enemies");
    const hasUser = enemies && mentionedUser
                  ? enemies.includes(mentionedUser.id)
                  : false;

    if(!enemies) enemies = initEnemies();
    return { mentionedUser, enemies, hasUser }
}

function sendUserToChat({ msg, mentionedUser, action }) {
    const eUser = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`**${mentionedUser.tag}** is **${action}** to use the bot!`)
        .setThumbnail(mentionedUser.avatarURL);

    try {
        msg.channel.send(eUser).then(async (m) => {
            await m.react("😢");
            await m.react("☺️");
        }).catch();
    } catch (error) { console.log(error); }
}

