const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const config = require('./config');
const seedDayWords = require('./dayWord/seeder');
const guessDayWord = require('./route_handlers/guess');
const getUserState = require('./route_handlers/state');
const setUserPreference = require('./route_handlers/preference');

global.dayWords = [];
// Make sure initialSeed is complete
// Startup procedures
const app = express();
mongoose.connect(config.mongoConnStr)
    .then(async () => {
        console.log('connected to db');
        // initial load of dayWords
        await seedDayWords();
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

app.use(express.json());

// Change dayWords every day at midnight
cron.schedule('0 0 * * *', async () => {
    await seedDayWords();
});

app.post('/preference', setUserPreference);
app.post('/guess', guessDayWord);
app.get('/state', getUserState);