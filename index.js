require('dotenv').config({ path: './config.env' });
const app = require('./app');
const connectDB = require('./server');

(async () => {
  try {
    await connectDB();
    const port = process.env.PORT;
    app.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (err) {
    console.log(err);
  }
})();
