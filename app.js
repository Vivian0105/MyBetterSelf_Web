const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/planDB", { useNewUrlParser: true });

const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

var userName = "Guest";

const planSchema = new mongoose.Schema({
    user: String,
    plan: String,
    timepoint: String,
    priority: Number
});

const Plan = mongoose.model("Plan", planSchema);

const plan = new Plan({
    user: userName,
    plan: "Connect website to database",
    timepoint: "daily",
    priority: 2    // low: 0, medium: 1, high: 2
});

const userSchema = new mongoose.Schema({
    Name: String,
    password: String
})

const User = mongoose.model("User", userSchema);

const user = new User({
    Name: "Vivian",
    password: "test123"
})

//user.save();


app.get("/", function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    Plan.find({ "timepoint": "daily" }, function (err, foundItem) {
        Plan.find({ "timepoint": "weekly" }, function (err, foundWeeklyItem) {
        res.render("home", { day: today.toLocaleDateString("en-US", options), foundItem: foundItem, foundWeeklyItem: foundWeeklyItem })
    }).sort([['priority', -1]]).limit(5)
    }).limit(5);
})

app.get("/weekly", function (req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    Plan.find({"timepoint": "weekly"}).sort([['priority', -1]]).exec(function(err, foundWeeklyItem) { res.render("weekly", { day: today.toLocaleDateString("en-US", options), foundWeeklyItem: foundWeeklyItem }) });
})

app.post("/add", function (req, res) {
    const itemName = req.body.todo;
    const newplan = new Plan({
        user: userName,
        plan: itemName,
        timepoint: "daily",
        priority: 2
    });
    newplan.save();
    res.redirect("/")
})

app.post("/weeklyadd", function (req, res) {
    console.log(req)
    if (req.body.Priority=='Priority'){
        var weeklypriority = 0;     // low: 0, medium: 1, high: 2
    } else{
        var weeklypriority = req.body.Priority;
    }
    const itemName=req.body.weeklyplan;
    const newplan = new Plan({
        user: userName,
        plan: itemName,
        timepoint: "weekly",
        priority: weeklypriority
    });
    newplan.save();
    res.redirect("/")
})


app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    Plan.findByIdAndDelete(checkedItemId, function(err){
        if(!err){
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        }
    })
})


app.listen(3000, function () {
    console.log("Listen to port 3000.")
})