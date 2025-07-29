const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const commentsController = require('../controllers/commentsController');
const ticketsController = require('../controllers/ticketsController');
const { query, body } = require('express-validator');
const { validate } = require('../middlewares/validate');
const upload = require('./../config/files-config');

//  Users
router.get('/users', 
    query('page').notEmpty().isInt().withMessage("Incorrect page search field"),
    validate,
    userController.getUsers);

router.get('/user-info',
    userController.getPeersonalUserInfo);

router.get('/user-info-search',
    query('email').notEmpty().isLength({max: 250}).isEmail().withMessage('Incorrect Email Field'),
    validate,
    userController.getSpecificUserInfo);

router.post('/user-login', 
    body('email').notEmpty().isLength({max: 250}).isEmail().withMessage('Enter a valid Email field'),
    body('password').notEmpty().isLength({min: 8,max: 512}).withMessage("Enter password field with at least 8 characters"),
    validate,
    userController.logIn);

router.post('/create-user', 
    body('email').notEmpty().withMessage('Incorrect Email Field').isLength({min:1, max: 250}).withMessage('Incorrect Email Field').isEmail().withMessage('Incorrect Email Field'),
    body('name').notEmpty().withMessage("Incorrect Name Field").isLength({min:1, max: 250}).withMessage("Incorrect Name Field").withMessage("Incorrect Name Field"),
    body('last_name').notEmpty().withMessage("Incorrect Last Name Field").isLength({min:1, max: 250}).withMessage("Incorrect Last Name Field"),
    body('password').notEmpty().withMessage("Incorrect Password Field").isLength({min: 8,max: 250}).withMessage("Incorrect Password Field"),
    body('rep_password').notEmpty().withMessage("Incorrect Repeat Password Field").isLength({min: 8,max: 250}).withMessage("Incorrect Repeat Password Field"),
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

router.delete('/delete-account', userController.deleteYourself);

router.post('/user-logout', userController.logOut);

//  Tickets
router.post('/ticket-create',
    upload.array('image', 5), 
    [
        body('title').notEmpty().withMessage("Incorrect title field").isLength({ max: 250 }).withMessage("Incorrect title field"),
        body('description').notEmpty().withMessage("Description field cannot be empty").isLength({max: 1024}).withMessage("You can enter 1024 max symbols in description field"),
    ],
    validate,
    ticketsController.CreateTicket);

router.delete('/ticket-delete', 
    query('ticket_id').notEmpty().isInt().withMessage("Incorrect Ticket ID"),
    validate,
    ticketsController.DeleteTicket);

router.put('/ticket-update-status', 
    body('ticket_id').notEmpty().isInt().withMessage("Incorrect Ticket ID"),
    body('new_status').notEmpty().isInt().withMessage("Incorrect Status number"),
    validate,
    ticketsController.ChangeTicketStatus);

router.get('/tickets-all',
    query('status').notEmpty().isInt().withMessage("Incorrect status search field"),
    query('page').notEmpty().isInt().withMessage("Incorrect page search field"),
    validate,
    ticketsController.GetAllTickets);

router.get('/ticket', 
    query('ticket_id').notEmpty().isInt().withMessage("Incorrect Ticket ID"),
    validate,
    ticketsController.GetTicketInfo);

router.get('/tickets',
    query('status').notEmpty().isInt().withMessage("Incorrect status search field"),
    query('page').notEmpty().isInt().withMessage("Incorrect page search field"),
    ticketsController.GetPersonalTickets);

//  Comments
router.post("/create-comment",
    body('ticket_id').notEmpty().isInt().withMessage("Incorrect Ticket ID"),
    body('message').notEmpty().isLength({min: 1,max: 500}).withMessage("Incorrect Text message"),
    validate,
    commentsController.CreateComment
)

router.get("/comments",
    query('ticket_id').notEmpty().isInt().withMessage("Incorrect Ticket ID"),
    validate,
    commentsController.GetComments
)

//  Change Role
router.put('/change-role', 
    body('user_id').notEmpty().isInt().withMessage('Incorrect user_id'),
    body('role').notEmpty().isLength({max:10}).withMessage("Incorrect role"),
    validate,
    userController.ChangeRole);

//  Subscribe and unsubscribe ticket
router.post('/sub-ticket', 
    body('ticket_id').notEmpty().isInt().withMessage('Incorrect ticket_id'),
    validate,
    userController.SubscribeTicket);

router.put('/sub-ticket', 
    body('ticket_id').notEmpty().isInt().withMessage('Incorrect ticket_id'),
    validate,
    userController.UnsubscribeTicket);


module.exports = router;