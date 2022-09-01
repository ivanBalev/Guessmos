const fs = require('fs');
const Word = require('./models/word');
const bgRegex = new RegExp('[а-яА-я]{5,12}', 'g');
const enRegex = new RegExp('[a-zA-Z]{5,12}', 'g');
require('dotenv').config({ path: './.env.development' });
const { connect } = require('./database');
const axios = require('axios');

(async () => {
  await connect();
  // TODO: describe seeding process in documentation *npm run seed ./resources/test.txt bg*
  try {
    const [path, language] = process.argv.slice(2);
    let words = '';
    const regex = language === 'en' ? enRegex : bgRegex;

    if (path.startsWith('http')) {
      const response = await axios.get(path);
      words = response.data;
    } else {
      words = fs.readFileSync(path, 'utf8');
    }

    words = [...words.matchAll(regex)].map((x) => x[0].toLowerCase());
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
