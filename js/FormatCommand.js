module.exports = function(msg, output) {
    return insertMentions(msg, output);
};

function insertMentions(msg, output) {
    let mentUsers = [...msg.mentions.users.values()];
    const numMentions = (output.match(/-m/g) || []).length;
    if((numMentions > mentUsers.length)) {
        const difference = numMentions - mentUsers.length;
        return `Missing **${difference}** mention${difference > 1 ? "s" : ""}!`;
    }
    for (let i = 0; i < numMentions; i++) output = output.replace("-m", mentUsers.shift());
    
    output = output.replace(/-u/g, msg.author);
    return output;
}