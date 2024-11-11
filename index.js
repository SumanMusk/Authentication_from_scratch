const express = require("express");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const userdata = require("./db_schema");

const { setter } = require("./map_service");
const { verify_user } = require("./middlewares/verify");

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
    res.render("index", { isLoggedIn });
});

app.get("/main-work", verify_user, (req, res) => {
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
    const { username, age, password } = req.body;

    const data = await userdata.findOne({ name: username });

    let alreadySigned = false;
    if(data !== null) {
        alreadySigned = true;
        res.render("signup", { name: username, alreadySigned: alreadySigned });
    }
    else {
        await userdata.create({ name: username, age: age, password: password });
        res.redirect("/login");
    }    
});

app.post("/login-verify", async (req, res) => {
    const { username, password } = req.body;
    
    // Simply we can do this for normal validation
    // const data_by_name = await userdata.findOne({ name: username, password: password });

    // for safety, if multiple if-else case conditions get satisfied then multiple res.render() can trigger causing error "Cannot set headers after they are sent to the client". So we write "return" in front of each res.render into each if-else cases.

    const data_by_name = await userdata.findOne({ name: username });
    const data_by_pass = await userdata.findOne({ password: password });

    let isAccExists = false;
    let isWrongName = false;
    let isWrongPass = false;

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
    else {        
        const loginCookie = uuidv4();
        res.cookie("token", loginCookie);

        res.cookie("LoggedUserName", username);
        setter(loginCookie, data_by_name._id); //map_service.js

        return res.redirect("/");
    }
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