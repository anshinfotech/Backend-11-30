const nodemailer = require("nodemailer");
const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "123654slkjfl;asdjkflkadsjf675347235";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "plotey88@gmail.com",
    pass: "cmzjeepiiodmfuxp",
  },
});

let newdata = async (req, res) => {
  let { username, password, email, phone } = req.body;
  try {
    const otp = Math.round(Math.random() * 100000);

    const securePassword = await bcrypt.hash(password, 10);

    await transporter.sendMail({
      from: "plotey88@gmail.com", // sender address
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
    res.status(200).json({ message: "Data submitted succesfuly", User : newdata });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

let alldata = async (req, res) => {
  try {
    const alldata = await userModel.find();
    res.status(200).json({ alldata });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

const verifyUser = async (req, res) => {
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
      await user.save();
      res.status(200).json({ message: "Otp verified succesfuly" });
    } else {
      res.status(400).json({ message: "Otp does not match" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

let singleuser = async (req, res) => {
  let { id } = req.params;
  try {
    const singleUserData = await userModel.findById(id);
    res.status(200).json({ singleUserData });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

let deletedUser = async (req, res) => {
  try {
    let { id } = req.params;

    const user = await userModel.findById(id);
    console.log(user);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const removedUser = await userModel.findByIdAndDelete(id);
      res.status(200).json({ removedUser });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

let updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let { newusername } = req.body;

    const user = await userModel.findById(id);
    console.log(user);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        {
          username: newusername,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ updatedUser });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUser = await userModel.findOne({ email });

    if (!isUser) {
      return res.status(400).json({
        message: "No user found with this email",
      });
    }

    const correctPass = await bcrypt.compare(password, isUser.password);

    if (!correctPass) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = await jwt.sign({ userID: isUser._id }, SECRET_KEY);
    isUser.token = token;
    isUser.save();

    res.cookie("userToken", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });

    res.status(200).json({
      message: "Login successful",
      User: isUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Failed to login user" });
  }
};

const logoutUser = async(req , res) => {
  try {
    const {userToken} = req.cookies;

    const user = await userModel.findOne({token: userToken});

    if(!user){
      return res.status(400).json({
        message: "No user found!",
      });
    }

    user.token = null;
    await user.save();

    res.clearCookie("userToken");

    res.status(200).json({
      message: "Logout successful",
    })
    
  } catch (error) {
    res
    .status(500)
    .json({ error: error.message, message: "Failed to Logout user" });
  }
}


module.exports = {
  newdata,
  alldata,
  verifyUser,
  singleuser,
  deletedUser,
  updateUser,
  loginUser,
  logoutUser,
};
