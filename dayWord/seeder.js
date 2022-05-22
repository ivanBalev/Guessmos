const wordService = require('../word/dbService');
const dayWordService = require('./dbService');
const { languages } = require('../word/constants');
const { defaultWordLength, defaultWordsCount } = require('../word/constants');


const seedDayWords = async () => {
    dayWords = [];
    for (const language in languages) {
        for (let i = 0; i < defaultWordsCount; i++) {
            const wordLength = parseInt(defaultWordLength + i);
            const queryObj = { language, length: wordLength };

            const wordsCount = await wordService.count(queryObj);
            const skipCount = Math.floor(Math.random() * wordsCount);

            const word = await wordService.findOne(queryObj, skipCount);
            // Add dayWord record
            await dayWordService.create(word);
            dayWords.push(word);
        }
    }
}

module.exports = seedDayWords;