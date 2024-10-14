const { sequelize } = require("../queries/core.js");

module.exports = {
  statusCheck,
  requestElevator,
};

/**
 * @swagger
 * /elevatorStatusCheck:
 *  get:
 *    tags:
 *       - "Elevator Status Check/Create"
 *    summary: Creates/Checks status of elevator based on ID supplied
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: query
 *        name: elevatorId
 *        type: number
 *    responses:
 *        200:
 *           description: Healthy Service
 *        503:
 *           description: Unhealthy Service
 */
async function statusCheck(req, res) {
  try {
    const { elevatorId } = req.query;

    const queryStatus = `SELECT elev."elevatorId", elev."currentFloor", elev."statusId", stat."status", elev."direction", elev."targetFloor", elev."updatedAt", elev."active", elev."queue" FROM "ElevatorState" elev 
      INNER JOIN "Status" stat ON elev."statusId" = stat."statusId" 
      WHERE "elevatorId"=${elevatorId};`;

    const result = await sequelize.query(queryStatus);

    if (result[0].length === 0) {
      const createQuery = `INSERT INTO "ElevatorState" ("elevatorId", "currentFloor", "statusId", "active" ) VALUES
      (${elevatorId}, 0, 1, true);`;

      const createElevator = await sequelize.query(createQuery);
      res.send({
        serviceName: "elevatorService",
        message: "Elevator does not exist. Elevator created",
        timestamp: Date.now(),
      });
    } else {
      res.send({
        serviceName: "elevatorService",
        result: result[0],
        message: "OK",
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    res.status(503).send();
  }
}

/**
 * @swagger
 * /requestElevator:
 *  post:
 *    tags:
 *       - "Request elevator"
 *    summary: Request elevator from the floor it is in to the floor requested based on ID
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: Request elevator
 *        description: Request elevator
 *        schema:
 *           type: object
 *           required:
 *              - elevatorId
 *              - currentFloor
 *              - targetFloor
 *           properties:
 *               elevatorId:
 *                 type: number
 *               currentFloor:
 *                 type: number
 *               targetFloor:
 *                 type: number
 *    responses:
 *        200:
 *           description: Success Response
 *        400:
 *           description: Bad request
 *        401:
 *           description: Unauthorized access
 *        404:
 *           description: Not Found
 */
async function requestElevator(req, res) {
  try {
    const { elevatorId, currentFloor, targetFloor } = req.body;
    console.log(elevatorId);
    const queryStatus = `SELECT elev."elevatorId", elev."currentFloor", elev."statusId", stat."status", elev."direction", elev."targetFloor", elev."updatedAt", elev."active", elev."queue" FROM "ElevatorState" elev INNER JOIN "Status" stat ON elev."statusId" = stat."statusId" WHERE "elevatorId"=${elevatorId};`;

    const result = await sequelize.query(queryStatus);

    if (result[0].length === 0) {
      res.status(400).json({ message: "Elevator ID nnot found" });
    } else {
      let elevatorState = result[0][0];

      console.log(elevatorState);

      if (elevatorState.statusId === 1) {
        startTrip(req.body);
      } else if (elevatorState.queue === null) {
        const queue = [JSON.stringify(req.body)];

        const body = {
          requestQueues: queue,
        };

        const updateQuery = `UPDATE "ElevatorState" SET "queue" = '${JSON.stringify(
          body
        )}' WHERE "elevatorId"=${elevatorId}`;

        const updateResult = await sequelize.query(updateQuery);

        console.log(updateResult);
      } else {
        const queue = elevatorState.queue;

        queue.requestQueues.push(JSON.stringify(req.body));

        const updateQuery = `UPDATE "ElevatorState" SET "queue" = '${JSON.stringify(
          queue
        )}' WHERE "elevatorId"=${elevatorId}`;

        console.log(updateQuery);
        sequelize.query(updateQuery);
      }

      res.send({
        serviceName: "elevatorService",
        result: elevatorState,
        message: "OK",
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const startTrip = async (req) => {
  let { elevatorId, currentFloor, targetFloor } = req;

  console.log("TEST");
  const elevQuery = `SELECT * FROM "ElevatorState" WHERE "elevatorId"=${elevatorId}`;

  saveSQLLog(elevQuery);
  const elevStatus = await sequelize.query(elevQuery);

  if (elevStatus[0][0].currentFloor === currentFloor) {
    pickUpAndGo(req);
  } else {
    for (
      let i = elevStatus[0][0].currentFloor;
      currentFloor > elevStatus[0][0].currentFloor
        ? i <= currentFloor
        : i >= currentFloor;
      currentFloor > elevStatus[0][0].currentFloor ? i++ : i--
    ) {
      setTimeout(() => {
        const direction =
          currentFloor > elevStatus[0][0].currentFloor ? "UP" : "DOWN";

        const currentLog =
          "ELEVATOR IN TRANSIT " +
          direction +
          " ON FLOOR: " +
          i +
          " FOR PICK UP";
        console.log(currentLog);
        logEvent(
          elevatorId,
          i,
          elevStatus[0][0].statusId,
          direction,
          targetFloor,
          currentLog
        );
        const updateQuery4 = `UPDATE "ElevatorState" SET "currentFloor"= ${i}, "direction"= '${direction}', "statusId"=2 WHERE "elevatorId"=${elevatorId}`;
        saveSQLLog(updateQuery4);
        sequelize.query(updateQuery4).then(() => {
          if (i === currentFloor) {
            pickUpAndGo(req);
          }
        });
      }, 5000 * (currentFloor > elevStatus[0][0].currentFloor ? i - elevStatus[0][0].currentFloor : elevStatus[0][0].currentFloor - i));
    }
  }
};

const pickUpAndGo = (req) => {
  let { elevatorId, currentFloor, targetFloor } = req;
  let currentLog;

  console.log("DOOR IS OPENING FOR PICKUP ON FLOOR: ", currentFloor);

  setTimeout(() => {
    const updateQuery = `UPDATE "ElevatorState" SET "statusId" = 3 WHERE "elevatorId"=${elevatorId}`;
    saveSQLLog(updateQuery);
    sequelize
      .query(updateQuery)
      .then(() => {
        currentLog = "DOOR IS CLOSING FOR PICKUP ON FLOOR: " + currentFloor;
        console.log(currentLog);
        logEvent(elevatorId, currentFloor, 3, null, targetFloor, currentLog);

        const updateQuery2 = `UPDATE "ElevatorState" SET "statusId" = 4 WHERE "elevatorId"=${elevatorId}`;
        saveSQLLog(updateQuery2);
        sequelize.query(updateQuery2).then(() => {
          setTimeout(() => {
            const updateQuery3 = `UPDATE "ElevatorState" SET "statusId" = 5 WHERE "elevatorId"=${elevatorId}`;
            logEvent(
              elevatorId,
              currentFloor,
              4,
              null,
              targetFloor,
              currentLog
            );
            saveSQLLog(updateQuery3);
            sequelize.query(updateQuery3).then(() => {
              for (
                let i = currentFloor;
                targetFloor > currentFloor
                  ? i <= targetFloor
                  : i >= targetFloor;
                targetFloor > currentFloor ? i++ : i--
              ) {
                setTimeout(() => {
                  const direction = targetFloor > currentFloor ? "UP" : "DOWN";
                  const updateQuery4 = `UPDATE "ElevatorState" SET "currentFloor"= ${i}, "direction"= '${direction}'  WHERE "elevatorId"=${elevatorId}`;
                  saveSQLLog(updateQuery4);
                  sequelize.query(updateQuery4).then(() => {
                    currentLog =
                      "ELEVATOR IN TRANSIT " + direction + " ON FLOOR: " + i;
                    console.log(currentLog);
                    logEvent(
                      elevatorId,
                      i,
                      5,
                      direction,
                      targetFloor,
                      currentLog
                    );

                    if (i === targetFloor) {
                      setTimeout(() => {
                        const updateQuery5 = `UPDATE "ElevatorState" SET "statusId" = 6, "direction"=NULL WHERE "elevatorId"=${elevatorId}`;
                        saveSQLLog(updateQuery5);
                        sequelize.query(updateQuery5).then(() => {
                          currentLog =
                            "DOOR IS OPENING FOR DROPOFF ON FLOOR: " +
                            targetFloor;
                          console.log(currentLog);
                          const updateQuery6 = `UPDATE "ElevatorState" SET "statusId" = 6, "direction"=NULL WHERE "elevatorId"=${elevatorId}`;
                          logEvent(
                            elevatorId,
                            i,
                            6,
                            null,
                            targetFloor,
                            currentLog
                          );

                          setTimeout(() => {
                            saveSQLLog(updateQuery6);
                            sequelize.query(updateQuery6).then(() => {
                              const updateQuery7 = `UPDATE "ElevatorState" SET "statusId" = 7, "direction"=NULL WHERE "elevatorId"=${elevatorId}`;
                              currentLog =
                                "DOOR IS CLOSING FOR DROPOFF ON FLOOR: " +
                                targetFloor;
                              console.log(currentLog);
                              logEvent(
                                elevatorId,
                                i,
                                7,
                                null,
                                targetFloor,
                                currentLog
                              );
                              saveSQLLog(updateQuery7);
                              sequelize.query(updateQuery7).then(async () => {
                                recheckQueue(elevatorId);
                              });
                            });
                          }, 2000);
                        });
                      }, 2000);
                    }
                  });
                }, 5000 * (targetFloor > currentFloor ? i - currentFloor : currentFloor - i));
              }
            });
          }, 2000);
        });
      })
      .catch((error) => {
        // An error occurred during the query
        console.error("Error executing query:", error);
      });
  }, 2000);
};

const recheckQueue = async (elevatorId) => {
  const elevQuery = `SELECT * FROM "ElevatorState" 
    WHERE "elevatorId"=${elevatorId};`;
  saveSQLLog(elevQuery);

  const elevStatus = await sequelize.query(elevQuery);

  if (
    elevStatus[0][0].queue.requestQueues.length === 0 ||
    elevStatus[0][0].queue === null
  ) {
    const updateQuery = `UPDATE "ElevatorState" SET "statusId" = 1 WHERE "elevatorId"=${elevatorId}`;
    const currentLog =
      "Elevator STATIONARY at floor: " + elevStatus[0][0].currentFloor;
    logEvent(
      elevatorId,
      elevStatus[0][0].currentFloor,
      1,
      null,
      null,
      currentLog
    );
    saveSQLLog(updateQuery);
    sequelize.query(updateQuery);
  } else {
    const req = JSON.parse(elevStatus[0][0].queue.requestQueues[0]);

    console.log(req);
    startTrip(req);

    let newQueue = elevStatus[0][0].queue;
    newQueue.requestQueues.splice(0, 1);

    const updateQuery2 = `UPDATE "ElevatorState" SET "queue" = '${JSON.stringify(
      newQueue
    )}' WHERE "elevatorId"=${elevatorId}`;
    saveSQLLog(updateQuery2);
    sequelize.query(updateQuery2);
  }
};

const logEvent = async (
  elevatorId,
  currentFloor,
  statusId,
  direction,
  targetFloor,
  log
) => {
  const sqlQuery = `INSERT INTO "ElevatorLog" ("elevatorId","currentFloor","statusId", "direction", "targetFloor", "log") VALUES
  (${elevatorId},${currentFloor},${statusId},'${direction}',${targetFloor},'${log}' );`;

  sequelize.query(sqlQuery);
};

const saveSQLLog = (sql) => {
  const query = sql.replaceAll(/"/g, "");

  const sqlQuery = `INSERT INTO "SQLLog" ("log") VALUES ('${query.replaceAll(
    "'",
    ""
  )}');`;
  sequelize.query(sqlQuery);
};
