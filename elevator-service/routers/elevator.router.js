const elevatorController = require("../controllers/elevator.controller");
const Keycloak = require("keycloak-connect");

const USER_ROLE = process.env.USER_ROLE || "express-user";
const ADMIN_ROLE = process.env.ADMIN_ROLE || "express-admin";

const kcConfig = {
  clientId: process.env.AUTH_CLIENT_ID || "secure-express-service",
  bearerOnly: true,
  serverUrl: process.env.AUTH_SERVER || "http://localhost:8080",
  realm: process.env.AUTH_REALM || "master",
};

const memoryStore = new session.MemoryStore();

Keycloak.prototype.accessDenied = function (request, response) {
  response.status(401);
  response.setHeader("Content-Type", "application/json");
  response.end(
    JSON.stringify({
      status: 401,
      message: "Unauthorized/Forbidden",
      result: { errorCode: "ERR-401", errorMessage: "Unauthorized/Forbidden" },
    })
  );
};

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

function adminOnly(token, request) {
  return token.hasRole(`realm:${ADMIN_ROLE}`);
}

function isAuthenticated(token, request) {
  return (
    token.hasRole(`realm:${ADMIN_ROLE}`) || token.hasRole(`realm:${USER_ROLE}`)
  );
}

app.use(
  session({
    secret: process.env.APP_SECRET || "BV&%R*BD66JH",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());

module.exports = function (router) {
  router.get(
    "/elevatorStatusCheck",
    [keycloak.protect(adminOnly)],
    elevatorController.statusCheck
  );

  router.post(
    "/requestElevator",
    [keycloak.protect(isAuthenticated)],
    elevatorController.requestElevator
  );
};
