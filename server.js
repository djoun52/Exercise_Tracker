const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const cors = require('cors')
require('dotenv').config()


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const User = require("./model/models.js").UserModel
const Exercice = require("./model/models.js").ExerciceModel

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", bodyParser.urlencoded({extended: false}) , (req, res)=>{
  let inputName = req.body["username"] 
  let newUser = new User({username: inputName })
  newUser.save((err,data)=>{
    if (err) return console.log(err);
    res.json({username : data.username , _id: data._id} )
  })
})

app.get("/api/users", (req, res)=>{
  User.find({}, (err , data)=>{
    if (err) return console.log(err);
    res.json(data)
  })
})
app.get("/api/delete", (req, res)=>{
  User.deleteMany({}, (err, data)=>{
    res.json({done: "all user delete"})
  })
})
app.post("/api/users/:_id/exercises", bodyParser.urlencoded({extended: false}) , (req, res)=>{

  let exerciceInfo = new Exercice({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date 
  })
  let idUser = req.params._id
  if (exerciceInfo.date === ""){
    exerciceInfo.date = new Date().toISOString().substring(0,10)
  }

  User.findByIdAndUpdate(idUser,{$push : {log: exerciceInfo}}, {new: true}, (err, data) =>{
    if (err) return console.log(err);

    let responseObject = {
        _id: data.id, 
        username: data.username,
        date: new Date(exerciceInfo.date).toDateString(),
        duration: exerciceInfo.duration,
        description: exerciceInfo.description
      };
    console.log(responseObject)
    res.json(responseObject);
  })
})


app.get("/api/users/:id/logs", bodyParser.urlencoded({extended: false}) , (req, res)=>{
  User.findById(req.params.id ,"_id username log" , (err, data)=>{
    if (err) return console.log(err);
    console.log(data)
    responseObject = {
      _id: data.id,
      username: data.username,
      count: data.log.length,

    }
    console.log(responseObject)
    res.json(responseObject)
  })

})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})