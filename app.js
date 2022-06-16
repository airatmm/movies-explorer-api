const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { MONGO_URL, PORT } = require('./utils/utils');

const app = express();

// подключаемся к серверу mongo
async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
}

app.get('/', (req, res) => {
  console.log('Hello, world!')
  res.send(req.body);
});

app.use(routes);

app.use(() => {
  throw new NotFoundError('Ой! Такой страницы нет');
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

main();
