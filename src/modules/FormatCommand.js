/**
 * Module to replace defined tags with whatever they represent
 * 
 * @module FormatCommands
 * @returns {String} Formatted custom command
 */
module.exports = function(msg, output) {
    return insertMentions(msg, output);
};

/**
 * Replaces `-m` tag with **Discord.User**
 * object of the user who was mentioned
 * 
 * Replaces `-u` tag with **Discord.User** object of
 * the user who executed the command
 * 
 * @param {Discord.Message} msg
 * @param {String} output
 * @returns {String}
 */
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