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
    console.log("all user delete")
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
  if (exerciceInfo.date === "" || exerciceInfo.date === undefined ){
    let date1= new Date()
    exerciceInfo.date = new Date( Date.parse(date1) - (date1.getTimezoneOffset() * 60 * 1000)).toDateString()

    
  }else{
    console.log(exerciceInfo.date)
    exerciceInfo.date = new Date(exerciceInfo.date).toDateString()
  }

  User.findByIdAndUpdate(idUser,{$push : {log: exerciceInfo}}, {new: true}, (err, data) =>{
    if (err) return console.log(err);

    let responseObject = {
        _id: data.id, 
        username: data.username,
        date: exerciceInfo.date,
        duration: exerciceInfo.duration,
        description: exerciceInfo.description
      };
    res.json(responseObject);
  })
})


app.get("/api/users/:id/logs", bodyParser.urlencoded({extended: false}) , (req, res)=>{
  let from =  Date.parse(req.query.from);
  let to = Date.parse(req.query.to);
  let limit = req.query.limit;
  let maxloop = 0;

    User.findById(req.params.id ,"_id username log" , (err, data)=>{
    if (err) return console.log(err);
    let responceLogObject = [];
    if(data.log.length != 0) {
      if (limit) {
        maxloop = limit;
      }else {
        maxloop = data.log.length;
      }
      let limitIndex = 0;
      for (x in data.log) {
        let dateStr = new Date(data.log[x].date)
        let dateint = Date.parse(dateStr);
        if(from && to){
          if (to > dateint && from < dateint){
            responceLogObject.push({
              description: data.log[x].description,
              duration: data.log[x].duration,
              date: new Date(data.log[x].date).toDateString()
            })
            limitIndex++
          }
        }else if(from == undefined && to){
          if (to > dateint){
            responceLogObject.push({
              description: data.log[x].description,
              duration: data.log[x].duration,
              date: new Date(data.log[x].date).toDateString()
            })
            limitIndex++
          }
        }else if(from && to == undefined){
          if (from < dateint ){
            responceLogObject.push({
              description: data.log[x].description,
              duration: data.log[x].duration,
              date: new Date(data.log[x].date).toDateString()
            })
            limitIndex++
          }
        }else{
          responceLogObject.push({
            description: data.log[x].description,
            duration: data.log[x].duration,
            date: new Date(data.log[x].date).toDateString()
          })
          limitIndex++
        }
        if (limit == limitIndex){
          break
        }
      }

    } 
    responseObject = {
      _id: data.id,
      username: data.username,
      count: data.log.length,
      log: responceLogObject
    }
    for (const key in responseObject.log) {
        console.log(responseObject.log[key].date)
        console.log(typeof responseObject.log[key].date)
    }
    res.json(responseObject)
  })

})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})