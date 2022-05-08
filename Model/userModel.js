//required mongoose package to define the schema
const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('email is invalid');
          }
        },
      },
      password: {
        type: String,
        trim: true,
        validate(value) {
          if (value.toLowerCase().includes('password')) {
            throw new Error('Password should not contain word: password');
          }
        },
      },
      phone: {
        type: String,
        unique: true,
        trim: true,
        validate(value) {
          if (!validator.isMobilePhone(value)) {
            throw new Error('Phone is invalid');
          }
        },
      },
      role: {
        type: String,
        default: 'guest',
        enum: ['guest', 'admin'],
      },
  

    },{ timestamps: true })

module.exports = mongoose.model('user', userSchema)