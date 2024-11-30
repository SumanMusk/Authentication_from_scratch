const userdata = require("../db_schema");

async function infoSetterToReqObj (req, res, next) {
    const { username, password, role } = req.body;

    const data_by_name = await userdata.findOne({ name: username });
    const data_by_pass = await userdata.findOne({ password: password });   

    let isAccExists = false;
    let isWrongName = false;
    let isWrongPass = false;

    // Not chking for role attribute
    if(data_by_name === null && data_by_pass === null) {
        isAccExists = true;
        return res.render("login", { isAccExists, isWrongName, isWrongPass });
    }
    else if(data_by_name !== null && data_by_pass === null) {
        isWrongPass = true;
        return res.render("login", { isAccExists, isWrongName, isWrongPass });
    }
    else if(data_by_name === null && data_by_pass !== null) {
        isWrongName = true;
        return res.render("login", { isAccExists, isWrongName, isWrongName });
    }

    const id = data_by_name._id;
    console.log(role);    
    req.user = { id, username, role, password };
    next();
}

module.exports = {
    infoSetterToReqObj,
}