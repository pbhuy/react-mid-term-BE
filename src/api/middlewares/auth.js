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

const authorizeUserAccess = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.role === 'user') next();
    else return sendErr(res, { status: 403, message: 'Access denied!' });
  });
};
const adminAccessOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.role === 'admin') next();
    else return sendErr(res, { status: 403, message: 'Access denied!' });
  });
};

module.exports = { adminAccessOnly, authorizeUserAccess, verifyToken };
