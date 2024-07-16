const express = require("express");
const mongoose = require("mongoose");
const PORT = 8000;
const server = express();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "plotey88@gmail.com",
    pass: "cmzjeepiiodmfuxp",
  },
});


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
DBConnection();

server.use(express.json());
// CRUD
// Create, Read, Update, Delete

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
});

const userModel = mongoose.model("Users", userSchema);

server.post("/submit", async (req, res) => {
  let { username, password, email, phone } = req.body;
  try {
    const otp = Math.round(Math.random() * 100000);

    const securePassword = await bcrypt.hash(password, 10);

    await transporter.sendMail({
      from: 'plotey88@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<h1>Hello Your otp is ${otp}</h1>`, // html body
    });


    const newdata = await userModel.create({
      username,
      password: securePassword,
      email,
      phone,
      otp,
    });
    res.status(200).json({ message: "Data submitted succesfuly", newdata });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
});

server.get("/alldata", async (req, res) => {
  try {
    const alldata = await userModel.find();
    res.status(200).json({ alldata });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
});

server.post("/verify-user", async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "Email is wrong / User does not exist" });
    }

    if (user.otp === otp) {
      user.otp = null;
      user.isVerified = true;
      await user.save()
      res.status(200).json({ message: "Otp verified succesfuly" });
    } else {
      res.status(400).json({ message: "Otp does not match" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
});


server.get("/singleuser/:id",async(req,res)=>{
  let {id} = req.params
  try {
    const singleUserData = await userModel.findById(id)
    res.status(200).json({singleUserData})
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
})


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
