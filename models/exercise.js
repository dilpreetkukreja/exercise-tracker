const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const excerciseSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    // default: Date.now()
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Excercise', excerciseSchema);
