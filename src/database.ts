import mongoose from 'mongoose';
const dbConnectionStr = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

// TODO: switch implementation based on env variable
// we'll have both mongoose and SQL options
// switch statement will determing what to export
export const connect = async () => {
  try {
    await mongoose.connect(dbConnectionStr);
    console.log(`Connected to db`);
  } catch (err) {
    console.log(err);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    console.log('Database dropped. Disconnected from db');
  } catch (err) {
    console.log(err);
  }
};
