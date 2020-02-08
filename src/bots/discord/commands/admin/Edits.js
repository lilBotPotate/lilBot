const {
    Discord,
    fs,
    Command,
    Universal   
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("EDITS")
      .setInfo("Get edits of a message")
      .addUse("EDITS {msg ID}", "Get edits of a message")
      .setCommand(sendEdits);
      
async function sendEdits(msg, args) {
    if(!args && args.length < 1) return msg.channel.send("You need to insert the message ID");
    const msgID = args.shift();
    if(isNaN(msgID)) return msg.channel.send("Invalid Message ID");
    const fMsg = await msg.channel.fetchMessage(msgID);
    const edits = fMsg.edits;
    if(!edits) return await msg.channel.send("No edits in this message!");
    await edits.reverse();
    let editsString = "";
    for (let e = 0; e < edits.length; e++) {
        const edit = edits[e];
        editsString += `[${e + 1}]: ${edit.content}\n`;
    }

    if(editsString.length < 1) return msg.channel.send("No edits!");
    if(editsString.length >= 1500) {
        const fileName = `./files/edits_${fMsg.id}.txt`;
        fs.writeFile(fileName, editsString, function(err) {
            if(err) return Universal.sendLog("error", `Failed to store edits file:\n${err}`);
            Universal.sendLog("info", `Stored edits file: ${fileName}`);
        }); 
        await msg.channel.send({ files: [fileName] });
        try {
            fs.unlinkSync(fileName);
            Universal.sendLog("info", `Deleted edits file: ${fileName}`);
        } catch (err) { return Universal.sendLog("error", `Failed to delete edits file:\n${err}`); }
    } else {
        const eEdits = new Discord.RichEmbed()
                     .setColor("RANDOM")
                     .setTitle(`Message ID: **${fMsg.id}**`)
                     .setURL(fMsg.url)
                     .setDescription(editsString);
        try { await msg.channel.send(eEdits); } 
        catch (error) {
            await msg.channel.send("Something went wrong. Don't try it again...");
        }
    }
}