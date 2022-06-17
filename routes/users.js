const usersRouter = require('express').Router();

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const { validateUserUpdate } = require('../validator/validator');

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', validateUserUpdate, updateUser);

module.exports = {
  usersRouter,
};
