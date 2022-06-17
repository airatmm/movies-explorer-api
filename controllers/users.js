const bcrypt = require('bcrypt');

const User = require('../models/user');
const { getToken } = require('../utils/jwt');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const DUPLICATE_MONGOOSE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const register = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Неправильные логин или пароль'));
    return;
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      name, email, password: hash,
    });
    const savedUser = await user.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка. Поля должны быть заполнены'));
      return;
    }
    if (err.code === DUPLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Поля логин и пароль обязательны'));
    return;
  }
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = await getToken(user);
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      // secure: true,
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
      next(new NotFoundError('Пользователь по заданному id отсутствует в базе'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Поля должны быть заполнены'));
      return;
    }
    next(err);
  }
};

const signout = (req, res) => {
  res.status(200).clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    // secure: true,
  }).send({ message: 'Выход' });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser,
  signout,
};
