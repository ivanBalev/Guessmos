const express = require('express');
const mongoose = require('mongoose');
const seedWords = require('./seeders/wordsSeeder');

const app = express();

const dbURI = '';

mongoose.connect(dbURI)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

seedWords({ path: './resources/shakespiro.txt', language: 'en' },
    { path: './resources/poezia.txt', language: 'bg' });
