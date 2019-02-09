let mongoose = require('mongoose');
let chalk = require('chalk');

mongoose.connect("mongodb://localhost:27017/SampleDB",{user:"",pass:""},function (err) {
    if(err){
        console.log(chalk.red("Error while connecting to mongo : " +err));
    }else {
        console.log("connected to mongodb : " + "mongodb://localhost:27017/SampleDB");
    }
});

module.exports = mongoose;
