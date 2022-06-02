import Word from './model';

async function create(content: string, language: string) {
    const word = new Word({
        content,
        language,
        length: content.length,
    });
    return await word.save();
}

async function findOneByContent(content: string) : Promise<any> {
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

async function findByIds(userGuessesWordIds: string[]) {
    return await Word.find({ '_id': { $in: userGuessesWordIds } })
}

async function findOne(queryObj: object, skipCount: number) { return Word.find(queryObj).skip(skipCount).findOne() };

async function count(queryObj: object) { return Word.countDocuments(queryObj) };

async function countAll(): Promise<number> { return Word.estimatedDocumentCount(); };

export default {
    create,
    findOneByContent,
    findByIds,
    findOne,
    count,
    countAll,
}