import mongoose from "mongoose";

var Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    cPassword: {
      type: String,
    },
    token: {
      type: String,
    },

isVarified: {
  type: Number,
  default: 0,
},
isAdmin: {
  type: Boolean,
  default: false,
},

  },
  { versionKey: false }
);

const User = mongoose.model("user", userSchema);

export default User;
