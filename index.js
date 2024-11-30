require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const userdata = require("./db_schema");

const { setter, jwt_setter } = require("./map_service");
const { verify_user, verify_by_jwt, restrictToNormal } = require("./middlewares/verify");
const { validateLoggedInOrNot } = require("./middlewares/isLoggedIn");
const { infoSetterToReqObj } = require("./middlewares/userInfoSetter");

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URl;

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "middlewares")));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

const isLoggedIn = false;

app.get("/", (req, res) => {
    const loggedIn_state = validateLoggedInOrNot(req);
    res.render("index", { isLoggedIn, loggedIn_state });
});

// stateful method validation
// app.get("/main-work", verify_user, (req, res) => {
//     const cookieUserName = req.cookies.LoggedUserName;
//     res.render("only_loggedIn", { cookieUserName });
// });

// stateless method validation (just using the verify_by_jwt() instead of using verify_user())
app.get("/main-work", verify_by_jwt, (req, res) => {
    const cookieUserName = req.cookies.LoggedUserName;
    res.render("only_loggedIn", { cookieUserName });
});

app.get("/admins-only", restrictToNormal(["NORMAL"]), (req, res) => {
    const cookieUserName = req.cookies.LoggedUserName;
    res.render("only_loggedIn", { cookieUserName });
});

app.get("/login", (req, res) => {
    res.render("login", { isAccExists: false, isWrongName: false, isWrongPass: false });
});

app.get("/sign-up", (req, res) => {
    res.render("signup", { name: "", alreadySigned: false });
});

app.post("/signup-verify", async (req, res) => {
    const { username, age, role, password } = req.body;

    const data = await userdata.findOne({ name: username });

    let alreadySigned = false;
    if(data !== null) {
        alreadySigned = true;
        res.render("signup", { name: username, alreadySigned: alreadySigned });
    }
    else {
        await userdata.create({ name: username, age: age, role: role, password: password });
        res.redirect("/login");
    }    
});

app.post("/login-verify", infoSetterToReqObj, async (req, res) => {
    const { id, username, password, role } = req.user;      
        // const loginCookie = uuidv4();
        // res.cookie("token", loginCookie);

        // res.cookie("LoggedUserName", username);
        // setter(loginCookie, data_by_name._id); //map_service.js

        // Using JWT token system: we'll create a token by jwt.sign() then we'll verify that user by passing the token into jwt.verify() in seperate two getter-setter methods in map_service.js file
    
    const token = jwt_setter(id, username, role); //map_service.js
    res.cookie("jwt_token_cookie", token);
    
    res.cookie("LoggedUserName", username);
    res.cookie("loggedIn_state", true);
    
    return res.redirect("/");
});

mongoose.connect(DB_URL)
.then(() => {
    console.log("db connected!");
})
.catch(() => {
    console.log("Failed to connect!");
});

app.listen(PORT, () => {
    console.log("server running!");
});

// mongodb $Env:MDB_CONNECTION_STRING
// Short form => mongosh