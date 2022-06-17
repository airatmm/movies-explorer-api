const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// JSON Web Token
// JSON объект закодированный с помощью секрета JWT_SECRET (пока простой как в тренажере)

const getToken = async (user) => jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

module.exports = { getToken };
