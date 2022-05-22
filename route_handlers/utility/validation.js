const { Word } = require('../../word/model');

const validateWord = async (word) => {
    // no word entered
    if (!word) {
        return { error: 'word must be entered' };
    }
    // no such word in dictionary
    if (!(await Word.findOne({ content: word }))) {
        return { error: 'word not in dictionary. please try another' };
    }
}

const validateGuess = (userGuesses, user, dayWord, word) => {
    // user preference does not match entered data
    if (user.wordLength != word.length) {
        return { error: `please insert word with length ${user.wordLength} in language ${user.wordLanguage} or change settings` };
    }
    // check attempts count
    if (userGuesses.length == user.attemptsCount) {
        return { error: 'no more attempts for this language and length' };
    }
    // check if user wasn't already correct
    if (userGuesses.includes(dayWord)) {
        return { error: 'you have already guessed the word successfully' };
    }
    // check if user hasn't already entered the same word
    if (userGuesses.includes(word)) {
        return { error: 'word already entered. please try another' };
    }
}

module.exports = {
    validateWord,
    validateGuess,
}