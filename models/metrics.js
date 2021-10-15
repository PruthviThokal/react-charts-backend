const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//metrics schema
const metricsSchema = new mongoose.Schema({
  _id: ObjectId,
  measure: {
    type: String,
    trim: true,
    required: true,
    text: true,
  },
  dimensions: [
    {
      name: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
});
metricsSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Metrics", metricsSchema);
