Hello there!

0. Install dependencies - npm i

1. Create .env.development file in your root directory with credentials for the development server

2. Seed data - 'npm run seed {resource path || resource url} {resource language}'

   - Example: 'npm run seed /resources/poezia.txt bg'
   - Example: 'npm run seed https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words en'

3. Start server - 'npm start'

4. Swagger API documentation = http://localhost:3000/docs

   - User id(uuid) is attached to response headers after first guess request
   - Set it in your request headers for subsequent requests to keep track of all your guesses

5. Run tests - 'npm test'
   - Create .env.test file in your root directory with credentials for the testing server
