Hello there!
This is an  <b>Express.js</b> clone of the famous web-based word game Wordle.
<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original-wordmark.svg" title="MongoDB" alt="MongoDB" width="40" height="40"/>&nbsp;
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLV3sTl-1g0Yjg_jaKpgOI4S_Cjs5vFU3MjqfffSEjuHYFmO2BCiiwyHT0tCtTOcoE6g&usqp=CAU" title="Express" alt="Express" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original.svg" title="Node.js" alt="Node.js" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-original.svg" title="TypeScript" alt="TypeScript" width="40" height="40"/>&nbsp;
</div>


To run it:

0. Install dependencies - npm i

1. Create .env.development file in your root directory with credentials for the development server

2. Seed data - 'npm run seed {resource path || resource url} {resource language}'

   - Example: 'npm run seed `/resources/poezia.txt bg`'
   - Example: 'npm run seed `https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words en`'

3. Start server - 'npm start'

4. Swagger API documentation = `http://localhost:3000/docs`

   - User id(uuid) is attached to response headers after first guess request
   - Set it in your request headers for subsequent requests to keep track of all your guesses

<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/mocha/mocha-plain.svg" title="Mocha" alt="Mocha" width="40" height="40"/>&nbsp;
</div>
5. Run tests - 'npm test'
   - Create .env.test file in your root directory with credentials for the testing server
