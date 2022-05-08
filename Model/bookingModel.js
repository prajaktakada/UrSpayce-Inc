const mongoose = require('mongoose');

const { Schema } = mongoose;
const bookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
     ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'ticket',
        required: true,
     }
});

const booking = mongoose.model('booking', bookingSchema);

module.exports = booking;
