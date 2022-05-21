const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const config = require('./config');
const seedWords = require('./word/wordsSeeder');
const loadDayWords = require('./word/loadDayWords');
const User = require('./user/userModel');
const Guess = require('./guess/guessModel');
const { Word } = require('./word/wordModel');

var dayWords = [];

// (async () => {
//     try {
//         await mongoose.connect(config.mongoConnStr);
//         console.log('connected to db');
//         app.listen(3000);
//     } catch (err) {
//         console.log(err);
//     }

// })

// Startup procedures
const app = express();
mongoose.connect(config.mongoConnStr)
    .then(() => {
        console.log('connected to db');
        (async () => {
            // Seed dictionary
            await seedWords({ path: './resources/shakespiro.txt', language: 'en' },
                { path: './resources/poezia.txt', language: 'bg' });
            // Initial load of dayWords
            await loadDayWords(dayWords);
        })();
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

app.use(express.json());

// Global procedures

// Change dayWords every day at midnight
// TODO: Check if this works
cron.schedule('0 0 * * *', async () => {
    dayWords = [];
    await loadDayWords(dayWords);
});

// Enter guess
app.post('/guess', async (req, res) => {
    const uuid = req.headers.uuid;
    const word = req.body.word?.toLowerCase();
    console.log(uuid, word);

    // no word entered
    if (!word) {
        res.send({ error: 'word must be entered' });
        return;
    }
    // No such word in dictionary
    // const sameWordFromDictionary = await Word.findOne({ content: word });
    // if (!sameWordFromDictionary) {
    //     res.send({ error: 'word not in dictionary. please try another' });
    //     return;
    // }
    const user = uuid ? await User.findById(uuid) : await new User().save();
    // no such user
    if (!user) {
        res.send({ error: 'invalid uuid. insert empty value to generate new uuid or try again' });
        return;
    }
    console.log(user);
    // user preference does not match entered data
    if (user.wordLength != word.length) {
        res.send({ error: `Please insert word with length ${user.wordLength} in language ${user.wordLanguage} or change settings` });
        return;
    }

    // get today's guesses
    const { todayStr, tomorrowStr } = getTodayTomorrowStrings();
    const userGuesses = (await Guess.find({
        userId: user._id.toString(),
        createdAt: {
            $gte: todayStr,
            $lte: tomorrowStr,
        },
        length: user.wordLength,
        language: user.wordLanguage,
    }))
        .map(w => w.content);
    console.log("USER GUESSES: " + userGuesses);

    // check attempts count
    if (userGuesses.length == user.attemptsCount) {
        res.send({ error: 'no more attempts for this language and length' });
        return;
    }

    let dayWord = (dayWords.find(w => w.length == user.wordLength &&
        w.language == user.wordLanguage)).content;
    // check if user wasn't already correct
    if (userGuesses.includes(dayWord)) {
        res.send({ error: 'you have already guessed the word successfully' });
        return;
    }

    // check if user hasn't already entered the same word
    if (userGuesses.includes(word)) {
        res.send({ error: 'word already entered. please try another' });
        return;
    }

    // Create guess
    const guess = new Guess({
        userId: user._id.toString(),
        content: word,
        length: word.length,
    });
    await guess.save();

    let result = []
    console.log("DAYWORD IS: " + dayWord);
    for (const idx in word) {
        const wordLetter = word[idx];

        const dayWordLetter = dayWord[idx];

        // TODO: rework below algorithm. needs priority search -> first green, then yellow.
        if (wordLetter === dayWordLetter) {
            result.push({ letter: wordLetter, state: 'green' });
            let arr = dayWord.split('');
            arr[idx] = '*';
            dayWord = arr.join('');
            console.log(dayWord);
        } else if (dayWord.includes(wordLetter)) {
            result.push({ letter: wordLetter, state: 'yellow' });
            let dayWordLetterIdx = dayWord.indexOf(wordLetter);
            let arr = dayWord.split('');
            arr[dayWordLetterIdx] = '*';
            dayWord = arr.join('');
            console.log(dayWord);
        } else {
            result.push({ letter: wordLetter, state: 'gray' });
            console.log(dayWord);
        }
    }

    res.append('uuid', user._id.toString());
    res.send(result);
    return;
});

function getTodayTomorrowStrings() {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const tomorrowStr = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;

    return { todayStr, tomorrowStr };
}


// TODO: Create user preference setting endpoint