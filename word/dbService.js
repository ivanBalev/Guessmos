const Word = require('./model');

const create = async (content, language) => {
    const word = new Word({
        content,
        language,
        length: content.length,
    });
    return await word.save();
}

const findOneByContent = async (content) => {
    if (!content) {
        return { error: 'word must be entered' };
    }
    const word = await Word.findOne({ content });

    // no such word in dictionary
    if (!word) {
        return { error: 'word not in dictionary. please try another' };
    }

    return word;
}

const findByIds = async (userGuessesWordIds) => {
    return await Word.find({ '_id': { $in: userGuessesWordIds } })
}

const findOne = async (queryObj, skipCount) => await Word.find(queryObj).skip(skipCount).findOne();

const count = async (queryObj) => await Word.countDocuments(queryObj);

const countAll = async () => await Word.estimatedDocumentCount();

module.exports = {
    create,
    findOneByContent,
    findByIds,
    findOne,
    count,
    countAll,
}