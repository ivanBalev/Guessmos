import guessService from '../guess/dbService';
import userService from '../user/dbService';
import wordService from '../word/dbService';
import { setGuessColors, getDayWord } from './utility/common';

const getUserState = async (req: any, res: any) => {
    const user = await userService.getUser(req.headers.uuid);
    if (user.error) {
        return res.send(user);
    }
    const userGuessesWordIds = (await guessService.getByUser(user)).map(g => g.wordId);
    const userGuesses = (await wordService.findByIds(userGuessesWordIds)).map(w => w.content);
    let dayWord = getDayWord(user);
    // Color guesses
    let allColoredWords: any[] = [];
    userGuesses.forEach(guess => {
        allColoredWords.push(setGuessColors(dayWord, guess));
    });
    return res.send(allColoredWords);
}

export default getUserState;

