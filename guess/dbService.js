const Guess = require('./model');

const getByUser = async (user) => {
    const { todayStr, tomorrowStr } = getDateStrings();
    const guesses = await Guess.find({
        userId: user.id,
        createdAt: {
            $gte: todayStr,
            $lte: tomorrowStr,
        },
        length: user.wordLength,
        language: user.wordLanguage,
    });
    return guesses;
}

const create = async (userId, word) => {
    return await new Guess(
        {
            userId,
            wordId: word.id,
            length: word.length,
            language: word.language,
        }
    ).save();
}

module.exports = {
    getByUser,
    create,
}

function getDateStrings() {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const tomorrowStr = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;

    return { todayStr, tomorrowStr };
}
