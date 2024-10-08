const express = require("express");
require("dotenv").config();

const cors = require("cors");
const mongoose = require("mongoose");
const MongoURI = process.env.MONGODB_URI;
const { sendResponse, AppError, catchAsync } = require("./helpers/utils");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const { error } = require("console");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);

mongoose
  .connect(MongoURI)
  .then(() => console.log(`DB connected ${MongoURI}`))
  .catch(() => {
    console.log(error);
  });

//error handler
// catch not found page

app.use((req, res, next) => {
  const err = new Error("not found");
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log("ERROR", err);
  if (err.isOperational) {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      err.errorType
    );
  } else {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;
