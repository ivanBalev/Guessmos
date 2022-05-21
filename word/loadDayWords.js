const { Word } = require('./wordModel');
const DayWord = require('./dayWordModel');
const languages = { en: 'en', bg: 'bg' };
const { defaultWordLength, defaultWordsCount } = require('./wordConstants');


const loadDayWords = async (dayWords) => {
    for (const language in languages) {
        for (let i = 0; i < defaultWordsCount; i++) {
            const findQueryObject = { language, length: parseInt(defaultWordLength + i) };
            const wordsCount = await Word.countDocuments(findQueryObject);
            const randomWordNumber = Math.floor(Math.random() * wordsCount);

            const word = await Word.find(findQueryObject).skip(randomWordNumber).findOne();
            // Upload to dayWords collection
            const dayWord = await addWordToDayWordsCollection(word);
            dayWords.push(dayWord);
        }
    }
}

async function addWordToDayWordsCollection(word) {
    const dayWord = new DayWord({
        content: word.content,
        language: word.language,
        length: word.length,
    });

    return await dayWord.save();;
}

module.exports = loadDayWords;
