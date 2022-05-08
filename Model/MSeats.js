const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    Seat_No: {
    type: Number,
    unique:true,
    size: 50
  },
  movieId:{
    type: mongoose.Types.ObjectId,
    ref: 'MovieShow',
    required: true,
},
Stype: {
  type: String,
  default: 'regular',
  enum: ['regular', 'premium'],
},
available:{
    type: Boolean,
    default: true
}
});

const MovieSeat = mongoose.model('Seat',SeatSchema);

module.exports = MovieSeat;
