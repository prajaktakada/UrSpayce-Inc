const mongoose = require('mongoose');

const { Schema } = mongoose;
const ticketSchema = new Schema({
    movieId:{
        type: mongoose.Types.ObjectId,
        ref: 'MovieShow',
        required: true,
    },
    seatId: {
        type: mongoose.Types.ObjectId,
        ref: 'Seat',
        required: true,
    },
    price: {type:Number,required: true},
    isDeleted: {
        type: Boolean,
        default: false
    }
 
},{ timestamps: true });

const Theatre = mongoose.model('ticket', ticketSchema);
module.exports = Theatre;