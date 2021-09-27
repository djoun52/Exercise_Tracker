require('dotenv').config();

const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const exerciceSchema = new Schema({
    description:  {type : String, required: true},
    duration: {type : Number, required: true},
    date: String
  })

const userSchema = new Schema({
    username : {type : String, required: true},
    log: [exerciceSchema]
})

let exo = mongoose.model("exercice", exerciceSchema);
let user = mongoose.model("user", userSchema);

exports.ExerciceModel = exo
exports.UserModel = user