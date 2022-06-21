const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');
const { secretKey } = require('../utils/configuration');
const { messageUnauthorizedErrorAuth } = require('../utils/constants');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey);
  } catch (err) {
    next(new UnauthorizedError(messageUnauthorizedErrorAuth));
    return;
  }
  req.user = payload;
  next();
};
