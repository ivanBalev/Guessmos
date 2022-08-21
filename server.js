const mongoose = require('mongoose');

const dbConnectionStr = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(dbConnectionStr);
    console.log(`Connected to db.`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
