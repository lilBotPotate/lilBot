const {
    Discord,
    fs,
    Command
} = require("../../../../imports/Imports");

module.exports = new Command.Admin()
      .setName("EDITS")
      .setInfo("Get edits of a message")
      .addUsage("EDITS {msg ID}", "Get edits of a message")
      .setCommand(sendEdits);
      
async function sendEdits(msg, args) {
    if(args.length < 1) return msg.channel.send("You need to insert the message ID");
    const msgID = args[0];
    if(isNaN(msgID)) return msg.channel.send("Message ID is invalid");
    const fMsg = await msg.channel.fetchMessage(msgID);
    const edits = fMsg.edits;
    if(!edits) return await msg.channel.send("No edits!");
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
            if(err) return `[Error]: ${err}`.sendLog();
            `[Server]: Stored file: ${fileName}`.sendLog();
        }); 
        await msg.channel.send({ files: [fileName] });
        try {
            fs.unlinkSync(fileName);
            `[Server]: Deleted file: ${fileName}`.sendLog();
        } catch(err) { `[Error]: ${err}`.sendLog(); }
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