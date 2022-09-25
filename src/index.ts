require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import app from './app';
import { connect } from './database';

(async () => {
  try {
    await connect();
    const port = process.env.PORT!;
    app.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (err) {
    console.log(err);
  }
})();

module.exports = app;
