require('dotenv').config();

const config = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/bitfilmsdb',
  PORT: process.env.PORT || 3000,
};

module.exports = config;
