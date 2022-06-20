const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const { MONGO_URL, PORT } = require('./utils/utils');
const limiter = require('./utils/rateLimitter');
const router = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');

const accessCors = [
  'https://movies.explorer.nomoreparties.sbs',
  'http://movies.explorer.nomoreparties.sbs',
  'http://localhost:3000',
];

const options = {
  origin: accessCors,
  method: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
}

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(cors(options));
app.use(requestLogger);
app.use(express.json());
app.use(limiter);
app.use(router);

app.use(() => {
  throw new NotFoundError('Ой! Такой страницы нет');
});

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);

main();
