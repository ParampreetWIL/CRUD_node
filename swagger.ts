import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express, { Application } from 'express';

const app: Application = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD API built in Node.js with express.js framework',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
