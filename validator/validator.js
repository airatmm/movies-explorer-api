const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const isValidLink = (value) => {
  if (!isURL(value)) {
    throw new Error('Некорректная ссылка');
  }
  return value;
};
// const regLink = /(http|https):\/\/(www)?\.?([A-Za-z0-9.-]+)\.([A-z]{2,})((?:\/[+~%/.\w-_]*)?\??(?:[-=&;%@.\w_]*)#?(?:[\w]*))?/;
// const regLink = /https?\:\/\/(www\.)?\d?\D{1,}#?/;

// USERS
// post /signup register
const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// post /signin login
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// path /users/me updateUser
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isValidLink),
    trailerLink: Joi.string().required().custom(isValidLink),
    thumbnail:Joi.string().required().custom(isValidLink),
    movieId:Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN:Joi.string().required(),
  }),
});

const validateMovieDelete = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateUserUpdate,
  validateCreateMovie,
  validateMovieDelete,
};
