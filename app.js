const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const config = require('./config');
const seedWords = require('./word/wordsSeeder');
const seedDayWords = require('./word/dayWord');
const DayWord = require('./models/dayWord');
const User = require('./models/user');
const Guess = require('./models/guess');

// Startup procedures
const app = express();

// (async () => {
//     try {
//         await mongoose.connect(config.mongoConnStr);
//         console.log('connected to db');
//         app.listen(3000);
//     } catch (err) {
//         console.log(err);
//     }

// })

mongoose.connect(config.mongoConnStr)
    .then(() => {
        console.log('connected to db');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

app.use(express.json());
seedWords({ path: './resources/shakespiro.txt', language: 'en' },
    { path: './resources/poezia.txt', language: 'bg' });


// Global
var dayWords = [];

// if this is app's first ever start
(async () => {
    if (await DayWord.estimatedDocumentCount() == 0) {

        dayWords.push(await seedDayWords());
        return;
    }
})();

// Change dayWord every day at midnight
cron.schedule('0 0 * * *', async () => {
    dayWords.push(await seedDayWords());
});

app.post('/guess', async (req, res) => {
    let uuid = req.headers.uuid;
    const user = await User.findById(uuid);

    if (!uuid) {
        // Validate word

        // Create user
    }








    const content = req.body.word.toLowerCase();
    // TODO: validate content

    if (!uuid) {
        // Create user
        const user = new User();
        const userId = (await user.save())._id.toString();
        // Create guess
        const guess = new Guess({
            userId,
            content,
        });
        // validate content
        // return how correct the word is
    }

    // Check if uuid is valid
    if (!user) {
        res.send({ error: "invalid user id" });
    }

    let today = new Date();
    let tomorrow = new Date();
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));

    // Get user's guesses from today
    const userWords = (await Guess.find({
        userId: user._id.toString(),
        createdAt: {
            // That +1...
            $gte: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            $lte: `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`,
        },
    }))
        .map(w => w.content);

    // check if user hasn't already entered the same word
    if (userWords.includes(content)) {
        res.send({ error: 'Word already entered. Please try another.' });
    }



    // TODO: return guess validity



});