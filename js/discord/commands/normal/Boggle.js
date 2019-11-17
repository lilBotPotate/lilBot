const {
    Discord,
    Canvas,
    request,
    GFun
} = require("../../../Imports.js");

const { dices } = require("../../../../json/boggle.json");

let boggleGrid = [];
let gameAuthor = 0;
let gameAuthorName = "";
let color = "";

module.exports = {
    name: "BOGGLE",
    description: {
        "info": "Boggle minigame",
        "uses": {
            "boggle start": "start a new game",
            "boggle solve [answers]": "hand in your answers. Seperate the answers with space",
            "boggle resend": "resends the Boggle grid",
        }
    },
    execute(client, msg, args) {
        const command = args[0] ? args.shift().toUpperCase() : null;
        switch(command) {
            case "NEW": 
            case "START":
            case "BEGIN": return sendNewGrid(msg);
            case "SOLVE": return solve(msg, args);
            case "RESEND": return resend(msg);
            default: return;
        }
    }
};

async function sendNewGrid(msg) {
    gameAuthor = msg.author.id;
    gameAuthorName = msg.author.username;
    color = await GFun.randomHexColor();

    await createBoggleGrid();
    const boggleImage = await createImage();
    const boggleEmbed = await new Discord.RichEmbed()
        .setColor(color)
        .setTitle(`**${gameAuthorName.toUpperCase()}**`)
        .setImage("attachment://boggle.png");

    msg.channel.send({ files: [boggleImage], embed: boggleEmbed });
    msg.delete();
}

async function createBoggleGrid() {
	const diceSet = dices[await Math.floor(Math.random() * dices.length)];
	const gridSize = await Math.sqrt(diceSet.length);

	let boggleArray = [];
	for (let i = 0; i < diceSet.length; i++) boggleArray[i] = diceSet[i][await Math.floor(await Math.random() * diceSet[i].length)];
    
    boggleArray = await boggleArray.shuffle();

	for (let i = 0; i < gridSize; i++) {
		let row = [];
		for (let j = 0; j < gridSize; j++) row[j] = boggleArray[gridSize * i + j];
		boggleGrid[i] = row;
	}
	return true;
}

async function createImage(bestGuess) {
	const canvas = await Canvas.createCanvas(406, 406);
	const ctx = await canvas.getContext("2d");

	ctx.strokeStyle = "#00cc00";
	ctx.fillStyle = "#ffffff";

	const frame = await Canvas.loadImage("./files/frame.png");

	await ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.font = "40px arial";
    ctx.fillStyle = "#ffffff";

	const shift = 53;
	for (let i = 0; i < boggleGrid.length; i++) {
		for (let j = 0; j < boggleGrid.length; j++) {
			await ctx.fillText(boggleGrid[i][j], j * 100 + shift, i * 100 + shift + 15);
		}
	}

	if(bestGuess) {
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#00cc00";
		ctx.fillStyle = "#cc0000";

		await ctx.beginPath();
		await ctx.moveTo(bestGuess[0][1] * 100 + shift, bestGuess[0][0] * 100 + shift);
		for (let i = 1; i < bestGuess.length; i++) {
			await ctx.lineTo(bestGuess[i][1]* 100 + shift, bestGuess[i][0]* 100 + shift);
			await ctx.moveTo(bestGuess[i][1]* 100 + shift, bestGuess[i][0]* 100 + shift);
		}
		await ctx.stroke();	
	}

	return await new Discord.Attachment(canvas.toBuffer(), "boggle.png");
}

async function solve(msg, args) {
    if(boggleGrid.length < 1) return "No game is in progress".sendTemporary(msg);
    if(msg.author.id != gameAuthor) return "You are not the one who started the game!".sendTemporary(msg);

    const answersSet = await new Set(await args.map(el => el.toLowerCase()));

    let boardString = "";
    for (let i = 0; i < boggleGrid.length; i++) {
		for (let j = 0; j < boggleGrid.length; j++) {
			boardString += boggleGrid[i][j];
		}
    }

    const url = `http://fuzzylogicinc.net/boggle/Solver.svc/?BoardID=${boardString}&Length=3&Size=4`;
    const jBoggle = await getJSON(url);

    let points = 0;
    let correct = [];
    let maxPoints = 0;
    let bestWord = "";

    for(solution of jBoggle.Solutions) {
        if(await answersSet.has(solution.Word)) {
            points += solution.Score;
            await correct.push(solution.Word);
            await answersSet.delete(solution.Word);
            if(solution.Score > maxPoints) {
                bestWord = solution.Word;
                maxPoints = solution.Score;
            } else if(solution.Score == maxPoints) {
                if(bestWord.length < solution.Word.length) bestWord = solution.Word;
            }
        }
    }

    const eBoggle = await new Discord.RichEmbed()
        .setColor(color)
        .setTitle(`**${await msg.author.username.toUpperCase()}'S SOLUTION**`)
        .addField("**POINTS**", `${points} (${maxPoints})`);

    if(correct.length > 0) await eBoggle.addField("**CORRECT**", await correct.sort().join(", ").replace(bestWord, `**${bestWord}**`));
    if(answersSet.size > 0) await eBoggle.addField("**WRONG**", await [...answersSet].sort().join(", "));

    await msg.channel.send(eBoggle);
    await msg.delete();
    boggleGrid = [];
}

async function resend(msg) {
    if(boggleGrid.length < 1) return "No game is in progress".sendTemporary(msg);
    const boggleImage = await createImage();
    const boggleEmbed = await new Discord.RichEmbed()
        .setColor(color)
        .setTitle(`**${gameAuthorName.toUpperCase()}**`)
		.setImage("attachment://boggle.png");

    msg.channel.send({ files: [boggleImage], embed: boggleEmbed });
}

function getJSON(url) {
    return new Promise(function (resolve, reject) {
        request(url, { json: true }, function (error, res, body) {
            if (!error && res.statusCode == 200) resolve(body);
            else reject(error);
        });
    });
}
