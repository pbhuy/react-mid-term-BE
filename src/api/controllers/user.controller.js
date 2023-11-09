const bcrypt = require('bcrypt');
const saltRounds = 10;

const { sendRes, sendErr } = require('../helpers/response');
const { createAccessToken } = require('../helpers/token');
const User = require('../models/user.model');
const cloudinary = require('../../config/cloudianry');

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    sendRes(res, 200, user, undefined);
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const userId = req.id;
    const { password } = req.body;
    // hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { returnDocument: 'after' },
    );
    sendRes(res, 200, user, undefined);
  } catch (error) {
    next(error);
  }
};
const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    // check user exist
    const foundUser = await User.findOne({ email });
    if (foundUser)
      return sendErr(res, { status: 409, message: 'Email is already exist' });
    // hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    await user.save();
    user.password = undefined;

    const access_token = createAccessToken(user);
    res.setHeader('Authorization', access_token);

    sendRes(res, 201, user, 'Register successfully');
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if user not exist
    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return sendErr(res, { status: 400, message: 'User not found' });
    // check password
    const isVerified = await foundUser.verifyPassword(password);
    if (!isVerified)
      return sendErr(res, { status: 400, message: 'Incorrect password' });
    // generate access token
    const access_token = createAccessToken(foundUser);
    res.setHeader('Authorization', access_token);
    sendRes(res, 200, access_token, 'Login successfully');
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    let result;
    if (req.file)
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatar',
      });
    const userId = req.id;
    const { last_name, first_name, email, region, sex, telephone, DOB } =
      req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        last_name,
        first_name,
        email,
        region,
        sex,
        telephone,
        DOB,
        avatar: result && result.url,
      },
      { returnDocument: 'after' },
    ).lean();
    delete user.password;
    sendRes(res, 200, user, 'Update profile successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, updateProfile, getUserById, resetPassword };
