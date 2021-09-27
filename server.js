const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const cors = require('cors')
require('dotenv').config()


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const user = require("./model/models.js").UserModel
const exercice = require("./model/models.js").ExerciceModel

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", bodyParser.urlencoded({extended: false}) , (req, res)=>{
  let inputName = req.body["username"] 
  let newUser = new user({username: inputName })
  newUser.save((err,data)=>{
    if (err) return console.log(err);
    res.json({username : data.username , _id: data._id} )
  })
})

app.get("/api/users", (req, res)=>{
  user.find({}, (err , data)=>{
    if (err) return console.log(err);
    res.json(data)
  })
})

app.post("/api/users/:_id/exercises", bodyParser.urlencoded({extended: false}) , (req, res)=>{
  res.json({})
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
