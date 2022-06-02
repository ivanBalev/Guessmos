import config from './config';
import mongoose from 'mongoose';
import seedWords from './word/seeder';
import { languages } from './word/constants';

mongoose.connect(config.mongoConnStr)
    .then(async () => {
        console.log('Connected to db')
        await seedWords({ path: './resources/shakespiro.txt', language: languages.en },
            { path: './resources/poezia.txt', language: languages.bg });
    })
    .catch(err => {
        console.log(err);
    });