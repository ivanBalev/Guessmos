const config = require('./config');
const mongoose = require('mongoose');
const seedWords = require('./word/seeder');
const { languages } = require('./word/constants');

mongoose.connect(config.mongoConnStr)
    .then(async () => {
        console.log('Connected to db')
        await seedWords({ path: './resources/shakespiro.txt', language: languages.en },
            { path: './resources/poezia.txt', language: languages.bg });
    })
    .catch(err => {
        console.log(err);
    });