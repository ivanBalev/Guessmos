const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(async () => {
    const port = 3000;
    app.listen(port);
    console.log(`Connected to db. Listening on port ${port}`);
  })
  .catch((err) => {
    console.log(err);
  });
