// Data Model for Users
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



// Data model for users
const productSchema = new Schema(
  {
    product_id: {type: String, required: true, unique: true },
    name: {type: String, required: true},
    price: mongoose.Decimal128,
    inventory_amount: Number,
    product_kind: String,
  }
);


// Export model
module.exports = mongoose.model("product", productSchema);