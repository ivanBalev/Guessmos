const userService = require('../user/dbService')
const guessService = require('../guess/dbService');
const { setGuessColors, getDayWord } = require('./utility/common');
const { validateWord, validateGuess } = require('./utility/validation');

const guessDayWord = async (req, res) => {
    const word = req.body.word?.toLowerCase();
    const validateWordResult = await validateWord(word);
    if (validateWordResult?.error) {
        return res.send(validateWordResult);
    }

    const user = await userService.getUser(req.headers.uuid);
    if (user.error) {
        return res.send(user);
    }
    const userGuesses = (await guessService.getByUser(user)).map(g => g.content);
    let dayWord = getDayWord(user);

    const validateGuessResult = validateGuess(userGuesses, user, dayWord, word)
    if (validateGuessResult?.error) {
        return res.send(validateGuessResult);
    }

    await guessService.create(user.id, word, user.wordLanguage);

    const coloredGuess = setGuessColors(dayWord, word);

    // format response
    res.append('uuid', user.id);
    res.send(coloredGuess);
    return;
}

module.exports = guessDayWord;