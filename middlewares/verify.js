const { getter, printt } = require("../map_service");
const userData = require("../db_schema");

function verify_user(req, res, next) {
    const userCookie = req.cookies.token;
    
    if(!userCookie)
        return res.redirect("/login");
    
    const id = getter(userCookie);
    if(!id)
        return res.redirect("/login");

    next();
}

module.exports = {
    verify_user,
};