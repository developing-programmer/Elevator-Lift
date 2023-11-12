const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../server.env")
});

const { app } = require("./app");

app.listen(process.env.ELEVATOR_SERVICE_PORT, () => {
  console.log(`Authentication-service is running on port ${process.env.ELEVATOR_SERVICE_PORT}`);
});
