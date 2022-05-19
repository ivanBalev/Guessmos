const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const config = require('./config');
const seedWords = require('./word/wordsSeeder');
const getDayWord = require('./word/dayWord');
const DayWord = require('./models/dayWord');

const app = express();

mongoose.connect(config.mongoConnStr)
    .then(() => {
        console.log('connected to db');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

seedWords({ path: './resources/shakespiro.txt', language: 'en' },
    { path: './resources/poezia.txt', language: 'bg' });

var dayWord;

(async () => {
    if (await DayWord.estimatedDocumentCount() == 0) {
        dayWord = await getDayWord();
        return;
    }

    if (!dayWord) {
        dayWord = await DayWord.findOne().sort({ 'createdAt': 'descending' });
    }
})();

// Change dayWord every day at midnight
cron.schedule('0 0 * * *', async () => {
    dayWord = await getDayWord();
});
