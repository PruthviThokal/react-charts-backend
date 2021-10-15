const express = require("express");
const router = express.Router();

//import controller methods
const {
  getDataPoints,
  getGraphs,
} = require("../controllers/graphDataController");

router.get("/get/datapoints", getDataPoints);

//route to get documents data per page
router.get("/graphs/:page", getGraphs);

module.exports = router;
