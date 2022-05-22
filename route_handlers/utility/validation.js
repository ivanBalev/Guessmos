const validateGuess = (userGuesses, user, dayWord, word) => {
    // user preference does not match entered data
    if (user.wordLength !== word.length) {
        return { error: `please insert word with length ${user.wordLength} or change settings` };
    }
    // user preference does not match entered data
    if (user.wordLanguage !== word.language) {
        return { error: `please insert word in language ${user.wordLanguage} or change settings` };
    }
    // check if user wasn't already correct
    if (userGuesses.includes(dayWord)) {
        return { error: 'you have already guessed the word successfully' };
    }
    // check if user hasn't already entered the same word
    if (userGuesses.includes(word.content)) {
        return { error: 'word already entered. please try another' };
    }
    // check attempts count
    if (userGuesses.length == user.attemptsCount) {
        return { error: 'no more attempts for this language and length' };
    }
}

module.exports = validateGuess;
