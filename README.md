Hello there!

0. Install dependencies - npm i

1. Create .env.test & .env.development files in your root directory with data for
   test and development servers (MongoDb Atlas 'connection string' and 'password')

2. Seed data - 'npm run seed {resource path || resource url} {resource language}'

   - Example: 'npm run seed /resources/poezia.txt bg'

3. Start server - 'npm start'

   - User id(uuid) is attached to response headers

4. Swagger API documentation = http://localhost:3000/docs

   - User id(uuid) is attached to response headers

5. Run tests - 'npm run test'
   - Make sure you've created the .env.test file in your root directory
   - Set CACHE_TTL=1 in your .env.test file. We're waiting for the cache
     clear in our tests so value needs to be as low as possible.
