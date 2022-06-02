import wordService from '../word/dbService';
import dayWordService from './dbService';
import { languages } from '../word/constants';
import { defaultWordLength, defaultWordsCount } from '../word/constants';


const seedDayWords = async () => {
    let newDayWords = [];

    for (const language in languages) {
        for (let i = 0; i < defaultWordsCount; i++) {
            const wordLength = defaultWordLength + i;
            const queryObj = { language, length: wordLength };

            const wordsCount = await wordService.count(queryObj);
            const skipCount = Math.floor(Math.random() * wordsCount);

            const word = (await wordService.findOne(queryObj, skipCount))!;
            // Add dayWord record
            await dayWordService.create(word);
            newDayWords.push(word);
        }
    }

    return newDayWords;
}

export default seedDayWords;