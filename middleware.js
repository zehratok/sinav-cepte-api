const jwt = require("jsonwebtoken")


module.exports = function (req, res, next) {
    const token = req.headers["x-access-token"]
    if (!token) return res.status(401).send("Invalid Token.")
    try {
        let user = {}
        user = jwt.verify(token, 'alaska', { ignoreExpiration: true })
        req.user = user
        next()
    } catch (ex) {
        res.status(401).send("Invalid Token.")
    }
}