const { Word } = require('./wordModel');
const fs = require('fs');

const seedWords = async (...resourceInfoArray) => {
    if (await Word.estimatedDocumentCount() != 0) {
        console.log('Words have already been seeded');
        return;
    }
    // TODO: language regex depending on resource language
    const regex = new RegExp('[a-zA-Zа-яА-я]{5,}', 'g');

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

            await saveDataToDb(uniqueMatches, resourceInfo);
        });
    }
}

async function saveDataToDb(uniqueMatches, resourceInfo) {
    let count = 0;

    for (const match of uniqueMatches) {
        const word = new Word({
            content: match,
            language: resourceInfo.language,
            length: match.length,
        });

        try {
            const savedWord = await word.save();
            console.log(savedWord.content);
        } catch (err) {
            console.error(err);
        }

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