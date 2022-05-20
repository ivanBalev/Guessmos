const { Word } = require('../models/word');
const DayWord = require('../models/dayWord');
const defaultWordLength = 5;
const defaultWordsCount = 5;
const languages = { en: 'en', bg: 'bg' };



const seedDayWordsForLang = async () => {
    let dayWords = [];

    for (const language in languages) {

        const wordsCount = await Word.estimatedDocumentCount({ language });
        let dayWords = [];

        for (let i = 0; i < defaultWordsCount; i++) {
            const randomWordNumber = Math.floor(Math.random() * wordsCount);

            let query;
            language ? query = Word.findOne({ language, }) : query = Word.findOne();
            query.skip(randomWordNumber);

            const word = await query;
            // Upload to dayWords collection
            dayWords.push(await addWordToDayWordsCollection(word));
        }
    }

    return dayWords();
}

function addWordToDayWordsCollection(word) {
    const dayWord = new DayWord({
        content: word.content,
        language: word.language,
    });

    return dayWord.save();;
}

module.exports = seedDayWords;
