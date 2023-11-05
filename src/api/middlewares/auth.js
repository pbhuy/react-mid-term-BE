const { sendErr } = require('../helpers/response');
const { decodeToken } = require('../helpers/token');

const verifyToken = function (req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return sendErr(res, {
      status: 401,
      message: 'Access denied! Missing or invalid token.',
    });
  try {
    const user = decodeToken(token);
    req.id = user.id;
    req.email = user.email;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyToken };
