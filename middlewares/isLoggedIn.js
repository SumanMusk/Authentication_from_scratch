function validateLoggedInOrNot(req) {
    const loggedIn_state = req.cookies.loggedIn_state;
    return loggedIn_state ? true : false;
}

module.exports = {
    validateLoggedInOrNot,
}