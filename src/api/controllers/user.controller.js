const { sendRes, sendErr } = require('../helpers/response');
const { createAccessToken } = require('../helpers/token');
const User = require('../models/user.model');

const baseURL = 'http://localhost:3000/images/';

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
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
    sendRes(res, 200, access_token, 'Login successfully');
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.id;
    const { last_name, first_name, email, region, sex, telephone, DOB } =
      req.body;
    const imageURL = req.file ? baseURL + req.file.filename : null;
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
        avatar: imageURL,
      },
      { returnDocument: 'after' },
    );
    sendRes(res, 200, user, 'Update profile successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, updateProfile, getUserById };
