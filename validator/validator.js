const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const { messageValidationLinkError } = require('../utils/constants');

const isValidLink = (value) => {
  if (!isURL(value)) {
    throw new Error(messageValidationLinkError);
  }
  return value;
};

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
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
    thumbnail: Joi.string().required().custom(isValidLink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieDelete = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateUserUpdate,
  validateCreateMovie,
  validateMovieDelete,
};
