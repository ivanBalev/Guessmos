require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const app = require('./app');
const { connect } = require('./database');

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

module.exports = app;
