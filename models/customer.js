// Data Model for Users
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



// Data model for users
const customerSchema = new Schema(
  {
    customer_id: {type: String, required: true, unique: true },
    kind: {type: String, required: true},
    name: {type: String},
    age: Number,
    gender: {type: String},
    street: {type: String},
    city: {type: String},
    state: {type: String},
    zipcode: {type: String},
    marriage: {type: String},
    income: {type: String},
    business_category: {type: String},
    annual_income: {type: String},
  }
);


// Export model
module.exports = mongoose.model("customer", customerSchema);