import { Request, Response } from 'express';
import userService from '../user/dbService';
import wordService from '../word/dbService';
import guessService from '../guess/dbService';
import { setGuessColors, getDayWord } from './utility/common';
import validateGuess from './utility/validation';

const guessDayWord = async (req: Request, res: Response) => {
    const word = await wordService.findOneByContent(req.body.word);
    if (word.error) {
        return res.send(word);
    }

    const user = await userService.getUser(req.headers.uuid);
    if (user.error) {
        return res.send(user);
    }
    const userGuessesWordIds = (await guessService.getByUser(user)).map(g => g.wordId);
    const userGuesses = (await wordService.findByIds(userGuessesWordIds)).map(w => w.content);
    let dayWord = getDayWord(user);
    console.log("DAYWORD IS: " + dayWord);
    const validateGuessResult = validateGuess(userGuesses, user, dayWord, word)
    if (validateGuessResult?.error) {
        return res.send(validateGuessResult);
    }

    await guessService.create(user.id, word);

    const coloredGuess = setGuessColors(dayWord, word.content);

    // format response
    res.append('uuid', user.id);
    res.send(coloredGuess);
    return;
}

export default guessDayWord;