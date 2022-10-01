import fs from 'fs';
import Word from './services/mongoose/WordService';
const bgRegex = new RegExp('[а-яА-я]{5,12}', 'g');
const enRegex = new RegExp('[a-zA-Z]{5,12}', 'g');
require('dotenv').config({ path: './.env.development' });
import { connect } from './database';
import axios from 'axios';

(async () => {
  await connect();
  try {
    const [path, language] = process.argv.slice(2);
    let words = '';
    const regex = language === 'en' ? enRegex : bgRegex;

    if (path.startsWith('http')) {
      const response = await axios.get(path);
      words = response.data;
    } else {
      words = fs.readFileSync(__dirname + path, 'utf8');
    }

    const matchedWords = [...words.matchAll(regex)].map((x) => x[0].toLowerCase());
    const distinctWordObjects = [...new Set(matchedWords)].map((x) => {
      return { content: x, language };
    });

    await Word.insertMany(distinctWordObjects);
    console.log('Seeding complete');
  } catch (err) {
    console.log('Error during seed ', err);
  }

  process.exit(0);
})();
