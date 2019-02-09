let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    name: String,
    email: {type:String,unique: true},
    mobile: String,
    image: { data: Buffer, type: String },
    createdDate: { type: Date, default: Date.now }
});

let UserModel = mongoose.model('users', Schema);

let create = function (values) {
    return UserModel.create(values);
}

let findOneByValues = function (values) {
    return UserModel.findOne(values).exec();
}

let findAllByValues = function (values, options) {
    return UserModel.find(values, [], options).exec();
}

module.exports = {
    create,
    findOneByValues,
    findAllByValues
}