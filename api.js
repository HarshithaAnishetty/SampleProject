let express = require('express');
let multiparty = require('connect-multiparty');
let multipartymiddleware = multiparty();
let _ = require('underscore');
let UserModel = require("./model");
let router = express.Router();

let requiresBody = (req,res,next)=>{
    if(req.body && _.isObject(req.body) && !_.isEmpty(req.body)){
        next();
    }else{
        res.status(400).json({status:false,message:"Invalid or empty data",data:null});
    }
}

let register = (req, res) => {

    let body = req.body;

    return new Promise((resolve, reject) => {
        if (!_.isObject(body) || _.isEmpty(body)) reject("Invalid Data");
        else if (!body.name) reject("Please enter name");
        else if (!body.email || !(/^\S+@\S+\.\S+/.test(body.email))) reject("Please provide valid email");
        else if(!body.mobile || !(/[0-9]{10}/.test(body.mobile)))reject("Please provide valid Phone number");
        else resolve(null);
    }).then(() => {
        UserModel.findOneByValues({ email: body.email })
            .then(response => {
                if (response) {
                    res.status(409).json({ status: false, message: 'User already exists', data: null });
                    return;
                }
                UserModel.create(body)
                    .then((response) => {
                        let data = response.toJSON();
                        res.status(200).json({ status: true, message: 'User registered', data: data });
                    }).catch((err) => {
                        if (err.code == '11000') {
                            res.status(409).json({ status: false, message: 'User already exists', data: null });
                        } else {
                            console.log(err);
                            res.status(500).json({ status: false, message: 'Internal server error', data: null });
                        }
                    });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: false, message: 'Internal server error', data: null });
            })
    }).catch((err) => {
        console.log(err);
        res.status(400).json({ status: false, message: err, data: null });
    });
};

let getAllUsers = (req, res) => {

    let limit = req.params.limit;
    let timestamp = req.params.timestamp;

    let options = {
        sort: { createdDate: -1 }
    };

    if (limit) options.limit = Number(limit);
    let matchQuery = {};
    if (timestamp) matchQuery.createdDate = { $lt: new Date(timestamp) };

    UserModel.findAllByValues(matchQuery, options)
        .then((response) => {
            // let usersData = [];
            // response.forEach((user) => {
            //     usersData.push(user);
            // });
            res.json({ status: true, message: 'Users data fetched', data: response });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ status: false, message: 'User Not Found', data: null });
        });
}

let uploadImages = (req, res) => {
    var fs = require('fs');
    
    fs.readFile(req.files.image.path, function (err, data) {
        if(err){
            res.send(err);
            return;
        }
        var timeStamp = new Date() - 0;
        var newPath = 'Images' + timeStamp + "" + req.files.image.name;
        fs.writeFile(newPath, data, function (err) {
            if (err) {
                res.send(err)
            }
            else {
                console.log(newPath);
                UserModel.create(data)
                .then((response) => {
                    console.log(response);
                    response.image = newPath;
                    response.save(function(err,data){
                        if(err){
                            res.status(500).json({ status: false, message: err, data: null });
                        }else{
                            res.status(200).json({ status: true, message: 'uploaded Image', data: data });
                        }
                    })
                }).catch((err) => {           
                        console.log(err);
                        res.status(500).json({ status: false, message: 'Internal server error', data: null });
                });
            }
        });
    });
};

router.post('/upload', multipartymiddleware,uploadImages);
router.post('/register',requiresBody,register);
router.get('/getUsers/:limit?/:timestamp?',getAllUsers);

module.exports = router;