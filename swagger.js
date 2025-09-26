const swaggerAutogen = require('swagger-autogen')();

const port = process.env.PORT || 3000;
const host = process.env.SWAGGER_HOST || `localhost:${port}`;

const doc = {
  info: {
    title: 'Library API',
    description: 'Books & Authors API (Week 3)'
  },
  host,
  schemes: host.startsWith('localhost') ? ['http'] : ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/books.js', './routes/authors.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('swagger.json generated at', outputFile);
  // Optionally start server here:
  // require('./server.js');
});
