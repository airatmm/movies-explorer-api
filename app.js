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

const app = express();
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

const accessCors = [
  'https://mesto-project-36.nomoredomains.xyz',
  'http://mesto-project-36.nomoredomains.xyz',
  'http://localhost:3000',
];

const options = {
  origin: accessCors,
  method: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(options));

// подключаемся к серверу mongo
async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
}
// подключаем логгер запросов
// Логгер запросов нужно подключить до всех обработчиков роутов
app.use(requestLogger);

app.use(helmet());

// app.get('/', (req, res) => {
//   res.send(req.body);
// });

// мидлвэр c методом express.json(),
// встроенный в express для распознавания входящего объекта запроса как объекта JSON.
app.use(express.json());
app.use(limiter);
app.use(router);

app.use(() => {
  throw new NotFoundError('Ой! Такой страницы нет');
});
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use(handleError); // централизованная обработка ошибок

app.listen(PORT);

main();
