const authenticationController = require("../controllers/authentication.controller");

module.exports = function (router) {
  router.get("/elevatorStatusCheck", authenticationController.statusCheck);

  router.post("/requestElevator", authenticationController.requestElevator);
};
