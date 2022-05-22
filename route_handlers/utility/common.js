const setGuessColors = (dayWord, word) => {
    let dayWordArr = [...dayWord];
    let result = [...word].map(c => { return { value: c, color: 'grey' } });
    // green
    result.forEach((c, idx) => {
        if (dayWord[idx] == c.value) {
            result[idx].color = 'green';
            dayWordArr[idx] = null;
        }
    })
    // yellow
    result.forEach((c, idx) => {
        if (dayWordArr.includes(c.value) && c.color != 'green') {
            result[idx].color = 'yellow';
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