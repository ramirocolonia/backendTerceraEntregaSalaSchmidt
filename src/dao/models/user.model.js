import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String},
  email: {type: String, required: true, index: true},
  age: {type: Number},
  password: {type: String},
  rol: {type: String, required: true, default: "USER"},
  cart: {
    type: {
        cartId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts"
        }
    }
  }
});

userSchema.pre("findOne", function(){
  this.populate("cart.cartId");
});

export const userModel = mongoose.model(usersCollection, userSchema);