const DayWord = require('./model');

const create = async (word) => {
    const dayWord = new DayWord({
        wordId: word.id,
        language: word.language,
        length: word.length,
    });

    return await dayWord.save();
}

module.exports = {
    create,
}