const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAccessToken = (user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );
  return token;
};
const decodeToken = (token) => {
  const user = jwt.verify(token, process.env.JWT_SECRET);
  return user;
};

module.exports = { createAccessToken, decodeToken };
