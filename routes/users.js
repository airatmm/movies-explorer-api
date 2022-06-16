const router = require('express').Router();

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const { validateUserUpdate } = require('../validator/validator');

users.get('/me', getCurrentUser);
users.patch('/me', validateUserUpdate, updateUser);

module.exports = router;
