var express = require("express");
var router = express.Router();

//authentication api
const authApi = require("./auth.api");
router.use("/auth", authApi);

//meApi

const meApi = require("./me.api");
router.use("/me", meApi);

//userApi

const userApi = require("./user.api");
router.use("/users", userApi);

//projectApi

const projectApi = require("./project.api");
router.use("/projects", projectApi);

//taskApi

const taskApi = require("./task.api");
router.use("/tasks", taskApi);

//commentApi

const commentApi = require("./comment.api");
router.use("/comments", commentApi);

//referenceApi

const referenceApi = require("./referenceDocument.api");

router.use("/references", referenceApi);

module.exports = router;
