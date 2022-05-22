const wordService = require('../word/dbService');
const dayWordService = require('./dbService');
const languages = { en: 'en', bg: 'bg' };
const { defaultWordLength, defaultWordsCount } = require('../word/constants');


const loadDayWords = async () => {
    dayWords = [];
    for (const language in languages) {
        for (let i = 0; i < defaultWordsCount; i++) {
            const wordLength = parseInt(defaultWordLength + i);
            const queryObj = { language, length: wordLength };

            const wordsCount = await wordService.count(queryObj);
            const skipCount = Math.floor(Math.random() * wordsCount);

            const word = await wordService.findOne(queryObj, skipCount);
            // Create dayWord
            const dayWord = await dayWordService.create(word);
            dayWords.push(dayWord);
        }
    }
}

module.exports = loadDayWords;