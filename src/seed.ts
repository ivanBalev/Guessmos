import fs from 'fs';
import Word from './services/WordService';
const bgRegex = new RegExp('[а-яА-я]{5,12}', 'g');
const enRegex = new RegExp('[a-zA-Z]{5,12}', 'g');
require('dotenv').config({ path: './.env.development' });
import { connect } from './database';
import axios from 'axios';

(async () => {

  // Connect to db
  await connect();

  try {
    // Geth resource's path and language from console input
    const [path, language] = process.argv.slice(2);

    // Define words (to be extracted from resource) and set regex for extraction
    let words = '';
    const regex = language === 'en' ? enRegex : bgRegex;

    // If path is a web link
    if (path.startsWith('http')) {

      // Get request & set words
      const response = await axios.get(path);
      words = response.data;
    } else {

      // Read resource & set words
      words = fs.readFileSync(__dirname + path, 'utf8');
    }

    // Filter out words that are too long/short and non-word characters
    const matchedWords = [...words.matchAll(regex)].map((x) => x[0].toLowerCase());

    // Preserve only the unique words and set their language
    const distinctWordObjects = [...new Set(matchedWords)].map((x) => {
      return { content: x, language };
    });

    // Save all to db
    await Word.insertMany(distinctWordObjects);
    console.log('Seeding complete');
  } catch (err) {
    console.log('Error during seed ', err);
  }

  process.exit(0);
})();
