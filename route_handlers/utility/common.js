const colors = {
    green: 'green',
    yellow: 'yellow',
    gray: 'gray',
}

const setGuessColors = (dayWord, word) => {
    let dayWordArr = [...dayWord];
    let result = [...word].map(c => { return { value: c, color: colors.gray } });
    // green
    result.forEach((c, idx) => {
        if (dayWord[idx] == c.value) {
            result[idx].color = colors.green;
            dayWordArr[idx] = null;
        }
    })
    // yellow
    result.forEach((c, idx) => {
        if (dayWordArr.includes(c.value) && c.color != colors.green) {
            result[idx].color = colors.yellow;
            dayWordArr[dayWordArr.indexOf(c.value)] = null;
        }
    })
    return result;
}

const getDayWord = (user) => (dayWords.find(w => w.length == user.wordLength && w.language == user.wordLanguage)).content;

module.exports = {
    setGuessColors,
    getDayWord,
}