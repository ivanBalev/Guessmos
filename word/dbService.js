const { Word } = require('./model');

const create = async (content, language) => {
    const word = new Word({
        content,
        language,
        length: content.length,
    });
    return await word.save();
}

const count = async (queryObj) => await Word.countDocuments(queryObj);

const countAll = async () => await Word.estimatedDocumentCount();

const findOne = async (queryObj, skipCount) => await Word.find(queryObj).skip(skipCount).findOne();

module.exports = {
    create,
    count,
    countAll,
    findOne,
}