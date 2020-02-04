/**
 * @file All the `prototypes` are created here 
 * @todo Make subclasses
 */

/**
 * Introduce yourself.
 * @method
 * @name String#sendTemporary
 * @returns {Void}
 */
String.prototype.sendTemporary = function(msg) {
    msg.channel.send(this.toString()).then((m) => {
        setTimeout(function () {
            m.delete();
        }, 2000);
    });
};

String.prototype.sendLog = function() {
    return console.log(`[${new Date().toLocaleString("en-GB").replace(",", "")}]${this.toString()}`);
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

"[Server][I]: Prototypes added".sendLog();