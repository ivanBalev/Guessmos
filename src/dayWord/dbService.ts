import { WordInput } from '../word/model';
import DayWord from './model';

const create = async (word: WordInput) => {
    const dayWord = new DayWord({
        wordId: word.id,
        language: word.language,
        length: word.length,
    });

    return await dayWord.save();
}

export default { create };
