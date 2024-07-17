const mongoose = require("mongoose");

const DBConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://demo:demo@cluster0.6xdpqe4.mongodb.net/"
    );
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = DBConnection;
