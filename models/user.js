const mongoose = require('mongoose');
const UserModel = new  mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default:null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true,
    versionKey: false
});
const user = mongoose.model('user', UserModel);
module.exports = user;