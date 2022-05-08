const mongoose = require('mongoose');

const { Schema } = mongoose;
const TheatreSchema = new Schema({
    theatrename: {type: String,required: true,trim: true,unique: true},
    address: {type:String,required: true},
    isDeleted: {
        type: Boolean,
        default: false
    }
 
},{ timestamps: true });

const Theatre = mongoose.model('Theatre', TheatreSchema);
module.exports = Theatre;