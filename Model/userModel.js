const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {},
  isVerified: {
    type: Boolean,
    default: false,
  },

  token : {type :String , default : null}
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
