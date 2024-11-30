let map = new Map();

function setter(key, value) {
    map.set(key, value);
}

function getter(key) {
    return map.get(key);
}



require("dotenv").config();
const JWT_KEY = process.env.JWT_KEY;
const jwt = require("jsonwebtoken");

function jwt_setter(_id, username, role) {
    return jwt.sign({
        id: _id,
        name: username,
        role: role,
    }, JWT_KEY);
}

function jwt_verify(token) {
    return jwt.verify(token, JWT_KEY);
}

function jwt_decode(token) {
    return jwt.decode(token);
}

module.exports = {
    setter,
    getter,
    jwt_setter,
    jwt_verify,
    jwt_decode,
};