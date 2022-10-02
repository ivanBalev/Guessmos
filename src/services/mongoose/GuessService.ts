import Guess from "../../models/Guess";
import User from "../../models/User";
import Word from "../../models/Word";
import IGuessService from "../interfaces/IGuessService";
import GuessRepository from "./GuessRepository";
import AppError from "../../utils/appError";
// Only 1 service per entity
// different repositories for each dbms
// Conditional import OR constructor injection?

// TODO: film screen with OBS, then create GIFs for how the data flows

const constants = {
  minLength: 5,
  maxLength: 11,
};

const colors = {
  green: 'green',
  yellow: 'yellow',
  gray: 'gray',
};


async function createOne(userId: string, word: Word): Promise<Guess> {
  // Validate data
  const guess = new Guess({
    userId: userId,
    wordId: word.id!,
    length: word.length,
    language: word.language,
    content: word.content,
  });
  // Create new guess in db
  return await GuessRepository.create(guess);
}

async function getByUser(user: User): Promise<Guess[]> {
  const { todayStr, tomorrowStr } = getDateStrings();
  const findQuery = {
    userId: user.id,
    createdAt: {
      $gte: todayStr,
      $lte: tomorrowStr,
    },
    length: user.wordLength,
    language: user.wordLanguage,
  };
  return await GuessRepository.find(findQuery);
}

function validateForUser(user: User, pastUserGuesses: string[], dayWord: string, word: Word): void {
  // user preference does not match entered data
  if (user.wordLength !== word.length) {
    throw new AppError(
      `Invalid input - please insert guess with length ${user.wordLength}`,
      400
    );
  }
  // user preference does not match entered data
  if (user.wordLanguage !== word.language) {
    throw new AppError(
      `Invalid input - please insert guess in language ${user.wordLanguage}`,
      400
    );
  }
  // user was already correct
  if (pastUserGuesses.includes(dayWord)) {
    throw new AppError(
      'Invalid input - you have already guessed the word successfully',
      400
    );
  }
  // user has already entered the same word
  if (pastUserGuesses.includes(word.content)) {
    throw new AppError(
      'Invalid input - word already entered. please try another',
      400
    );
  }
  // attempts count exceeded
  if (pastUserGuesses.length >= user.attemptsCount) {
    throw new AppError(
      'Invalid input - no more attempts for this language and length',
      400
    );
  }
}

async function checkWord(userId: string, word: Word, dayWord: string): Promise<{ color: string; letter: string; }[]> {
  /**
 * Throw error if guess & dayWord don't match guess entity
 * length constraints or don't match each other's length
 */
  if (
    word.content.length < constants.minLength ||
    word.content.length > constants.maxLength ||
    dayWord.length < constants.minLength ||
    dayWord.length > constants.maxLength ||
    dayWord.length !== word.content.length
  ) {
    // TODO: make this error more specific
    throw new AppError('Invalid input - unsupported data length', 400);
  }

  await createOne(userId, word);
  return colorLetters(dayWord, word.content);
}

export function colorLetters(dayWord: string, word: string) {
  // Color letters
  // Prepares input for comparison
  let dayWordArr = [...dayWord];
  let result = [...word].map((c) => {
    return { letter: c, color: colors.gray };
  });

  /**
   * Colors all exact matches in green and remove letter
   * from dayWord array to indicate it has been matched
   */
  result.forEach((c, idx) => {
    if (dayWord[idx] == c.letter) {
      result[idx].color = colors.green;
      // TODO: not sure if empty char won't cause bugs
      dayWordArr[idx] = '';
    }
  });

  /**
   * Colors all letters that exist but not in the right place
   * in yellow and remove respective letter from dayWord array
   */
  result.forEach((c, idx) => {
    if (dayWordArr.includes(c.letter) && c.color != colors.green) {
      result[idx].color = colors.yellow;
      // TODO: not sure if empty char won't cause bugs
      dayWordArr[dayWordArr.indexOf(c.letter)] = '';
    }
  });
  return result;
}

// TODO: use library
// Helper date formatting function
function getDateStrings() {
  let today = new Date();
  let tomorrow = new Date();
  tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1
    }-${today.getDate()}`;
  const tomorrowStr = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1
    }-${tomorrow.getDate()}`;

  return { todayStr, tomorrowStr };
}

const service: IGuessService = {
  checkWord,
  validateForUser,
  getByUser,
  colorLetters
}

export default service
