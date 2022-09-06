Hello there!

0. Create .env.test & .env.development files in your root directory with data for
   test and development servers (MongoDb Atlas 'connection string' and 'password')

1. Seed data - 'npm run seed {resource path || resource url} {resource language}'

   - Example: 'npm run seed ./resources/poezia.txt bg'

2. Start server - 'npm start'

   - uuid is attached to response headers

3. Swagger API documentation = http://localhost:3000/docs

   - uuid is attached to response headers

4. Run tests - 'npm run test'
   - Make sure you've created the .env.test file in your root directory
