const Metrics = require("../models/metrics");
var mongoosePaginate = require("mongoose-paginate");
var aggregateQuery = Metrics.aggregate();
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const mongoose = require("mongoose");
require("dotenv").config();

//controller function to fetch all the documents from metrics collection
exports.getDataPoints = (req, res) => {
  mongoose.connect(process.env.DATABASE, function (err, db) {
    if (err) {
      console.log(err);
    } else {
      var collection = db.collection("metrics");
      collection.find().toArray(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.send(data);
        }
      });
    }
  });
};

exports.getGraphs = async (req, res) => {
  const page = req.params.page;
  //database connection
  mongoose.connect(process.env.DATABASE, function (err, db) {
    if (err) {
      console.log(err);
    } else {
      //pagination query
      Metrics.aggregatePaginate(
        aggregateQuery,
        { page: page, limit: 4 },
        function (err, result) {
          if (err) {
            console.err(err);
          } else {
            const resArray = [];
            //looping for getting collection names per page with limit
            for (let i = 0; i < 4; i++) {
              const variable = result.docs[i]._id;
              const collec = db.collection(variable);
              const min_value = [];
              const max_value = [];
              const original_value = [];
              const forcasted_value = [];
              const time_stamp = [];

              //finding documents from fetched collections
              collec.find().toArray(function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  data.forEach((element) => {
                    min_value.push(element.min_band);
                    max_value.push(element.max_band);
                    original_value.push(element.original_value);
                    forcasted_value.push(element.forecasted_value);
                    time_stamp.push(element.timestamp);
                  });
                  //pushing final result in array
                  resArray.push({
                    min_value: min_value,
                    max_value: max_value,
                    original_value: original_value,
                    forcasted_value: forcasted_value,
                    time_stamp: time_stamp,
                  });
                }
              });
            }
            //setting timeout to get final result
            setTimeout(() => {
              res.json(resArray);
            }, 1000);
          }
        }
      );
    }
  });
};
