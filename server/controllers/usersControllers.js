const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  //get the user by finding and selecting the password which was entered and minimizing it using lean.
  const users = await User.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  //destructuring the req following from req object to get the credentials
  const { username, password, roles } = req.body;
  //confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: "All fields are required" });
  }
  //Check for duplicates(check if there is any other user with same username)
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "duplicate username" });
  }
  //hash password
  const hashedpwd = await bcrypt.hash(password, 10); //
  const userObject = { username, password: hashedpwd, roles };

  //create and store user
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: `New User ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data recieved" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();

  //Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username." });
  }

  user.usernaem = username;
  user.roles = roles;
  user.active = active;
});

const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
