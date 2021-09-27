require('dotenv').config();

const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {type : String, required: true}
})

let user = mongoose.model("user", userSchema);


exports.UserModel = user