const express = require("express");
const PORT = 8000;
const server = express();
const DBConnection = require("./database");
const userRouter = require("./Routes/userRoutes.js");
const cookieParser = require('cookie-parser');

DBConnection();

server.use(express.json());
server.use(cookieParser());
server.use("/", userRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
