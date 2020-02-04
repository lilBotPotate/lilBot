module.exports = {
    name: "DICE",
    description: {
        "info": "Dice that dice",
        "uses": {
            "dice": "returns a random value from 1 - 6"
        }
    },
    execute(msg, args) {
        const text = "**ROLLING!**";
        msg.channel.send(text).then(m => {
            rolling(5, m);
        });

        function rolling(counter, m) {
            setTimeout( function() { 
                const number = Math.floor(Math.random() * 6) + 1;
                m.edit(`${text}\n**${number}**`).then(() => {
                    if(counter == 0) return m.edit(`You rolled a **${number}**`);
                    rolling(counter - 1, m);
                }); 
            }, 500);
        }
    }
};

