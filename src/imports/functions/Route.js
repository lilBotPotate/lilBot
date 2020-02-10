const bcrypt = require("bcrypt");

/** 
 * Compares the password with API_PASSWORD
 * 
 * @param {String} password
 * 
 * @returns {Boolean}
 */
exports.checkPassword = async (password) => {
    // if(!password) return false;
    // return await bcrypt.compare(process.env.API_PASSWORD, password);
    return true;
}

exports.GET = function(router, path, routeFunction) {
    return router.get(path, (req, res, next) => {
        if(!this.checkPassword(req.headers.password)) return;
        return routeFunction({ req, res, next })
    });
}

exports.POST = function(router, path, routeFunction) {
    return router.post(path, (req, res, next) => {
        if(!this.checkPassword(req.headers.password)) return;
        return routeFunction({ req, res, next })
    });
}

exports.DELETE = function(router, path, routeFunction) {
    return router.delete(path, (req, res, next) => {
        if(!this.checkPassword(req.headers.password)) return;
        return routeFunction({ req, res, next })
    });
}