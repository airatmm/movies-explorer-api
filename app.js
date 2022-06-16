const express = require('express');
const mongoose = require('mongoose');

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

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

main();
