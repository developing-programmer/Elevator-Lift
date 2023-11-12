const express = require("express");
const app = express();
const helmet = require("helmet");
const url = require("url");
let router = express.Router();
let cors = require("cors");

app.use(cors());
app.use(express.json());

require("./swagger/swagger")(app);

require("./routers/elevator.router")(router);

app.use("/api/authenticationService", router);

module.exports = { app };

app.use(helmet());
