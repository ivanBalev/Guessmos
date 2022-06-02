import * as express from 'express';
import mongoose from 'mongoose';
import * as cron from 'node-cron';

import config from './config';
import seedDayWords from './dayWord/seeder';
import guessDayWord from './route_handlers/guess';
import getUserState from './route_handlers/state';
import setUserPreference from './route_handlers/preference';

// TODO: global dayWords needs to be removed
export var dayWords: any[] = [];
// Make sure initialSeed is complete
// Startup procedures
const app = express();
mongoose.connect(config.mongoConnStr)
    .then(async () => {
        console.log('connected to db');
        // initial load of dayWords
        dayWords = await seedDayWords();
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

app.use(express.json());

// Change dayWords every day at midnight
cron.schedule('0 0 * * *', async () => {
    dayWords = await seedDayWords();
});

app.post('/preference', setUserPreference);
app.post('/guess', guessDayWord);
app.get('/state', getUserState);