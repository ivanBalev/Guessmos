const fs = require('fs');
const wordService = require('./dbService');
const regex = new RegExp('[a-zA-Zа-яА-я]{5,}', 'g');

const seedWords = async (...resourceInfoArray) => {
    if (await wordService.countAll() != 0) {
        console.log('Words already seeded');
        return;
    }

    for (const resourceInfo of resourceInfoArray) {
        // read resource
        fs.readFile(resourceInfo.path, 'utf8', async (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            // distinct resource
            const allMatches = [...data.matchAll(regex)].map(x => x[0].toLowerCase());
            const uniqueMatches = [...new Set(allMatches)];

            await saveDataToDb(uniqueMatches, resourceInfo.language);
        });
    }
}

async function saveDataToDb(words, language) {
    let count = 0;

    for (const word of words) {
        console.log(word);
        await wordService.create(word, language);
        // limit request count(free-tier mongo crashes otherwise)
        if (count > 5000) {
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