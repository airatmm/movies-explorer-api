const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
});

module.exports = mongoose.model('movie', movieSchema);
