require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/moviesdb';
const PORT = process.env.PORT || 3000;

const secretKey = 'some-secret-key';

module.exports = {
  MONGO_URL,
  PORT,
  secretKey,
}
