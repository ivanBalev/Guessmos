require('dotenv').config({ path: './.env.sample' });
const app = require('./app');
const { connect } = require('./server');

(async () => {
  try {
    await connect();
    const port = process.env.PORT;
    app.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (err) {
    console.log(err);
  }
})();
