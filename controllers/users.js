const bcrypt = require('bcrypt');

const User = require('../models/user');
const { getToken } = require('../utils/jwt');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const {
  DUPLICATE_MONGOOSE_ERROR_CODE,
  SALT_ROUNDS,
  messageBadRequestError,
  messageConflictError,
  messageNotFoundErrorUserId,
  messageSignout,
} = require('../utils/constants');

const register = async (req, res, next) => {
  const {
    email, name, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      email, name, password: hash,
    });
    const savedUser = await user.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(messageBadRequestError));
      return;
    }
    if (err.code === DUPLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictError(messageConflictError));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = await getToken(user);
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError(messageNotFoundErrorUserId));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// возможно нужно пассворд тоже менять
const updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(messageBadRequestError));
      return;
    }
    if (err.code === DUPLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictError(messageConflictError));
      return;
    }
    next(err);
  }
};

const signout = (req, res) => {
  res.status(200).clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  }).send({ message: messageSignout });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser,
  signout,
};
