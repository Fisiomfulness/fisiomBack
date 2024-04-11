const { DB_SERVER } = require("./config/envConfig");
const mongoose = require("mongoose");

mongoose
  .connect(DB_SERVER, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
