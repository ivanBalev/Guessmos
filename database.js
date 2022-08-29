const mongoose = require('mongoose');

const dbConnectionStr = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connect = async () => {
  try {
    await mongoose.connect(dbConnectionStr);
    console.log(`Connected to db`);
  } catch (err) {
    console.log(err);
  }
};

const disconnect = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    console.log('Database dropped. Disconnected from db');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connect, disconnect };
