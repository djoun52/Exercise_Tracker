require('dotenv').config();

const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const exerciceSchema = new Schema({
    username:  {type : String, required: true},
    description:  {type : String, required: true},
    duration: {type : Number},
    date: "Mon Jan 01 1990"
  })

let user = mongoose.model("exercice", exerciceSchema);


exports.ExerciceModel = user