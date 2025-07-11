const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { query, body } = require('express-validator');
const {validate} = require('../middlewares/validate');


router.get('/users', userController.getUsers);

router.get('/user-info', 
    query('email'),
    validate,
    userController.getUserInfo);

router.post('/user-login', 
    body('email').notEmpty().isLength({max: 250}).isEmail().withMessage('Incorrect Email Field'),
    body('password').notEmpty().isLength({min: 8,max: 250}).withMessage("Incorrect Password Field"),
    validate,
    userController.logIn);

router.post('/create-user', 
    body('email').notEmpty().isLength({max: 250}).isEmail().withMessage('Incorrect Email Field'),
    body('name').notEmpty().isLength({max: 250}).withMessage("Incorrect Name Field"),
    body('last_name').notEmpty().isLength({max: 250}).withMessage("Incorrect Last Name Field"),
    body('password').notEmpty().isLength({min: 8,max: 250}).withMessage("Incorrect Password Field"),
    validate,
    userController.createUser);

router.put('/update/names', 
    body('name').notEmpty().isLength({max: 250}).withMessage("Incorrect Name Field"),
    body('last_name').notEmpty().isLength({max: 250}).withMessage("Incorrect Last Name Field"),
    validate,
    userController.updateUserNames);

router.put('/update/password', 
    body('old_password').notEmpty().isLength({min: 8, max: 250}).withMessage("Incorrect Password Field"),
    body('new_password').notEmpty().isLength({min: 8, max: 250}).withMessage("Incorrect Password Field"),
    validate,
    userController.updateUserPassword);

router.delete('/users', 
    body('email').notEmpty().isLength({max: 250}).isEmail().withMessage('Incorrect Email Field'),
    validate,
    userController.deleteUser);

router.post('/user-logout', userController.logOut);

module.exports = router;