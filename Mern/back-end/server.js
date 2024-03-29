require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./congif/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;
const cookieParser = require("cookie-parser");
app.use(express.json());
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./congif/corsOptions");

console.log(process.env.NODE_ENV);

connectDB();
app.use(cors(corsOptions));
app.use(logger);

app.use(express.json());
app.use(cookieParser());
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));
app.use("/", express.static(path.join(__dirname, "public")));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

console.log("Hello");
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
