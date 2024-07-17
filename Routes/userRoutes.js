const express = require("express");
const { alldata, newdata, singleuser, verifyUser, deletedUser, updateUser } = require("../Controller/userController");

const router = express.Router();

router.get("/alldata",alldata)
router.post("/submit",newdata)
router.get("/singleuser/:id",singleuser)
router.post("/verify-user",verifyUser)
router.delete("/delete-user/:id",deletedUser)
router.put("/update-user/:id",updateUser)


module.exports = router;
