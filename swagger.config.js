const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Port de plaisance de Russell',
      version: '1.0.0',
      description: 'Documentation simple de l\'API',
    },
    servers: [
      {
        url: 'https://port-russell-api-g4o5.onrender.com',
        description: 'Serveur de production',
      },
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },schemas: {
        Catway: {
          type: "object",
          properties: {
            catwayNumber: { type: "integer" },
            catwayType: { type: "string" },
            catwayState: { type: "string" }
          }
        },
        Reservation: {
          type: "object",
          properties: {
            catwayNumber: { type: "integer" },
            clientName: { type: "string" },
            boatName: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" }
          }
        },
        User: {
          type: "object",
          properties: {
            username: { type: "string" },
            email: { type: "string" }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./routes/*.js"]
};

module.exports = require('swagger-jsdoc')(options);