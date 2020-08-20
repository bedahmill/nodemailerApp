const mongoose = require('mongoose');

const {Schema} = mongoose;
const contactModel = new Schema({
    username: {type:String},
    telephone: {type:Number},
    email: {type:String},
    message: {type:String}
});

const contact = mongoose.model('Contact', contactModel);

module.exports = contact;