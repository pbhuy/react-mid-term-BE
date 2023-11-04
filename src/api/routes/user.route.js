const userController = require('../controllers/user.controller');
const userRoute = require('express').Router();

userRoute.post('/auth/register', userController.register);
userRoute.post('/auth/login', userController.login);
userRoute.put('/update', userController.updateProfile);

module.exports = userRoute;
