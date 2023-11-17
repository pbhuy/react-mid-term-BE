const userRoute = require('express').Router();

const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth');
const uploader = require('../middlewares/uploader');

userRoute.get('/', userController.getUsers);
userRoute.get('/:id', userController.getUserById);
userRoute.post('/auth/register', userController.register);
userRoute.post('/auth/login', userController.login);
userRoute.patch('/auth/reset', verifyToken, userController.resetPassword);
userRoute.put(
  '/update',
  verifyToken,
  uploader.single('avatar'),
  userController.updateProfile,
);
userRoute.delete('/', userController.deleteUsers);

module.exports = userRoute;
