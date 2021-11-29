const express = require("express");
const locations = require("./locations.js");
const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.static("frontend/public"));

app.use(express.static("frontend/build"));

app.use("/locations", locations);

const shutdown = () => {
  console.log("Closing HTTP server");
  server.close(() => {
    console.log("Server closed");
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const server = app.listen(8080, () => {
  console.log(`Listening on port ${server.address().port}`);
});
