const { sendRes, sendErr } = require('../helpers/response');
const { createAccessToken } = require('../helpers/token');
const User = require('../models/user.model');

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    // check user exist
    const foundUser = await User.findOne({ email });
    if (foundUser)
      return sendErr(res, { status: 409, message: 'Email is already exist' });

    const user = new User({ first_name, last_name, email, password });
    await user.save();

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
    sendRes(res, 200, undefined, 'Login successfully');
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    throw new Error('Hello World');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, updateProfile };
