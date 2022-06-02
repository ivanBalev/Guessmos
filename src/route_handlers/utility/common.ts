import { dayWords } from '../../app';

const colors = {
    green: 'green',
    yellow: 'yellow',
    gray: 'gray',
}

export const setGuessColors = (dayWord: any, word: any) => {
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

export const getDayWord = (user: any) => (dayWords.find(w => w.length == user.wordLength && w.language == user.wordLanguage)).content;