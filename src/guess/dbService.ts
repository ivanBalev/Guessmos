import Guess from './model';

const getByUser = async (user: any) => {
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

const create = async (userId: string, word: any) => {
    // TODO: Abstract 1 more time to decouple from server framework
    return await new Guess(
        {
            userId,
            wordId: word.id,
            length: word.length,
            language: word.language,
        }
    ).save();
}

function getDateStrings() {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const tomorrowStr = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;

    return { todayStr, tomorrowStr };
}

export default {
    getByUser,
    create,
}