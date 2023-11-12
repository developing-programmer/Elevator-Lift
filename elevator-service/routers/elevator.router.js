const elevatorController = require("../controllers/elevator.controller");

module.exports = function (router) {
  router.get("/elevatorStatusCheck", elevatorController.statusCheck);

  router.post("/requestElevator", elevatorController.requestElevator);
};
