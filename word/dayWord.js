const { Word } = require('../models/word');
const DayWord = require('../models/dayWord');

const getDayWord = async () => {
    const wordsCount = await Word.estimatedDocumentCount();
    const randomWordNumber = Math.floor(Math.random() * wordsCount);
    const word = await Word.findOne().skip(randomWordNumber);
    const dayWord = await addWordToDayWordsCollection(word);
    return dayWord;
}

function addWordToDayWordsCollection(word) {
    const dayWord = new DayWord({
        content: word.content,
        language: word.language,
    });

    return dayWord.save();;
}

module.exports = getDayWord;
