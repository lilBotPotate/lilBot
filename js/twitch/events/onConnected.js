module.exports = function(addr, port) {
    `[Server]: Connected to ${addr}:${port}`.sendLog();
};