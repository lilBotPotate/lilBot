/* String Prototypes */ 
String.prototype.distance = function(char) {
    var index = this.indexOf(char);

    if (index === -1) {
        console.log(char + " does not appear in " + this);
    } else {
        console.log(char + " is " + (this.length - index) + " characters from the end of the string!");
    }
};

String.prototype.sendTemporary = function(msg) {
    msg.channel.send(this.toString()).then((m) => {
        setTimeout(function () {
            m.delete();
        }, 2000);
    });
};

String.prototype.sendLog = function() {
    const d = new Date();
    const dateFormat = ("0" + d.getDate()).slice(-2) 
                     + "-" + ("0" + (d.getMonth() + 1)).slice(-2) 
                     + "-" + d.getFullYear() 
                     + " " + ("0" + d.getHours()).slice(-2) 
                     + ":" + ("0" + d.getMinutes()).slice(-2)
                     + ":" + ("0" + d.getSeconds()).slice(-2);

    return console.log(`[${dateFormat}]${this.toString()}`);
};

/* Array Prototypes */
Array.prototype.shuffle = function() {
    let arr = [...this];
    let newArr = [];
    while(arr.length > 0) {
        const elPos = Math.floor(Math.random() * arr.length);
        newArr.push(arr[elPos]);
        arr.splice(elPos, 1);
    }
    return newArr;
};