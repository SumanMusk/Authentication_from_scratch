const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
}, 
    { collection: "allData" }
);

const userdata = mongoose.model("login-model", schema);

module.exports = userdata;