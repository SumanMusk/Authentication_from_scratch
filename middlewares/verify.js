const { getter, jwt_verify, jwt_decode } = require("../map_service");
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

function verify_by_jwt(req, res, next) {
    const token = req.cookies.jwt_token_cookie;
    if(!token)
        return res.redirect("/login");

    const verify_res = jwt_verify(token);
    if(!verify_res)
        return res.redirect("/login");

    next();
}

function restrictToNormal(roles) {
    return function(req, res, next) {
        const token = req.cookies.jwt_token_cookie;
        if(!token)
            return res.redirect("/login");

        const verify_res = jwt_verify(token);
        if(!verify_res)
            return res.redirect("/login");

        const { id, name, role } = jwt_decode(token);
        if(roles.includes(role))
            return res.end("UnAuthorized!");

        next();
    }
}

module.exports = {
    verify_user,
    verify_by_jwt,
    restrictToNormal,
};