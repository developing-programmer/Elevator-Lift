let swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const serviceBasePath = `/api/authenticationService`

module.exports = function (app) {
  // swagger definition
  let swaggerDefinition = {
    swagger: "2.0",
    info: {
      title: "Beem Elevator APIs",
      description: "RESTful API for Tushop Authentication Microservice",
      version: "1.0"
    },
    produces: ["application/json"],
    host: process.env.HOST_NAME,
    basePath: serviceBasePath,
    securityDefinitions: {
      APIKeyHeader: {
        type: "apiKey",
        in: "header",
        name: "authorization"
      }
    }
  };

  // options for the swagger docs
  let options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    explorer: true,
    // path to the API docs
    apis: ['./controllers/*.js']
  };
  let extraOptions = {
    explorer: true,
    swaggerOptions: {
      validatorUrl: null
    },
    customSiteTitle: "Swagger - ElevatorService"
  };
  // initialize swagger-jsdoc
  let swaggerSpec = swaggerJSDoc(options);
  require('swagger-model-validator')(swaggerSpec);

  app.use(`/swagger/v1`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, extraOptions));

  //serve swagger
  app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(swaggerSpec);
  });
};
