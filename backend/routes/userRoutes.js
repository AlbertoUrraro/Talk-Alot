const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUserProfile,
  resetPassword,
  forgotPasswordUser,
  deleteAccount
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const protectps= require("../middleware/resetPasswordMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/register").post(registerUser);
router.post("/login",authUser);
router.route("/deleteAccount").delete(protect,deleteAccount);
router.route("/profile").post(protect, updateUserProfile);
router.route("/forgotpassword").post(forgotPasswordUser);
router.route("/resetpassword").post(protectps, resetPassword);


module.exports = router;
