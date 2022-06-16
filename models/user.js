const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Некорректный E-mail',
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

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    // по умолчанию хеш пароля пользователя не будет возвращаться из базы,
    // но для аутентификации хэш пароля нужен (метод .select + 'password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные email или пароль');
      }
      return bcrypt.compare(password, user.password) // сравниваем переданный пароль и хеш из базы
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные email или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
