const mongoose = require('mongoose');

const movieShowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  
  language: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  theatreId:{
    type: mongoose.Types.ObjectId,
    ref: 'Theatre',
    required: true,
},
  duration: {
    type:Date,
    required: true,
  },
  seatCategories: {
    Mtype: { type: String,required: true},
    price: { type: Number,required: true},
    totalSeats: { type: Number,required: true }
  }

});

const MovieShow = mongoose.model('MovieShow', movieShowSchema);

module.exports = MovieShow;
