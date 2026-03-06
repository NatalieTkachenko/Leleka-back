// src/docs/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Leleka API', version: '1.0.0' },
    servers: [{ url: '/api' }],

    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      { name: 'Diary', description: 'Diary management endpoints' },
      { name: 'Tasks', description: 'Tasks management endpoints' },
      { name: 'Dashboard', description: 'Dashboard management endpoints' },
    ],
  },
  apis: ['./src/routes/**/*.js'], // важливо: шлях від кореня проєкту
};

export const swaggerSpec = swaggerJSDoc(options);
