const Word = require('../models/word');
const fs = require('fs');

const seedWords = async (...resourceInfoArray) => {
    if (await Word.estimatedDocumentCount() != 0) {
        console.log('Words have already been seeded');
        return;
    }

    const regex = new RegExp('[a-zA-Zа-яА-я]{5,}', 'g');

    for (const resourceInfo of resourceInfoArray) {
        // read resource
        fs.readFile(resourceInfo.path, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            // distinct resource
            const allMatches = [...data.matchAll(regex)].map(x => x[0].toLowerCase());
            const uniqueMatches = [...new Set(allMatches)];

            saveDataToDb(uniqueMatches);
        });
    }
}

async function saveDataToDb(uniqueMatches) {
    let count = 0;

    for (const match of uniqueMatches) {
        const word = new Word({
            content: match,
            language: resourceInfo.language,
        });

        word.save()
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });

        // limit request count(free-tier mongo crashes otherwise)
        if (count > 1000) {
            await wait(1000);
            count = 0;
        }
        count++;
    }
}

function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, time);
    });
}

module.exports = seedWords;