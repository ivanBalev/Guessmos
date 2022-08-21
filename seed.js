const fs = require('fs');
const Word = require('./word/model');
const regex = new RegExp('[a-zA-Zа-яА-я]{5,}', 'g');
require('dotenv').config({ path: './config.env' });
const connectDB = require('./server');

(async () => {
  await connectDB();
  // TODO: describe seeding process in documentation *npm run seed ./resources/test.txt bg*
  try {
    const [path, language] = process.argv.slice(2);
    const words = [...fs.readFileSync(path, 'utf8').matchAll(regex)].map((x) =>
      x[0].toLowerCase()
    );
    const distinctWords = [...new Set(words)].map((x) => {
      return { content: x, language, length: x.length };
    });

    await Word.insertMany(distinctWords);
    console.log('Seeding complete');
  } catch (err) {
    console.log('Error during seed ', err);
  }

  process.exit(0);
})();
