const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { messageUnauthorizedErrorGeneral, messageValidationEmailError } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => isEmail(email),
      message: messageValidationEmailError,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
  },
});

// Функция findUserByCredentials не должна быть стрелочной.
// Это сделано, чтобы мы могли пользоваться this.
// Иначе оно было бы задано статически,
// ведь стрелочные функции запоминают значение this при объявлении

// Метод findUserByCredentials. Поиск пользователя по почте
// собственный метод. Mongoose позволяет добавить его в схему записав в свойство statics

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');
  // по умолчанию хеш пароля пользователя не будет возвращаться из базы,
  // но для аутентификации хэш пароля нужен (метод .select + 'password')
  if (!user) {
    throw new UnauthorizedError(messageUnauthorizedErrorGeneral);
  }
  // сравниваем переданный пароль и хеш из базы
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new UnauthorizedError(messageUnauthorizedErrorGeneral);
  }
  return user;
};

module.exports = mongoose.model('user', userSchema);
