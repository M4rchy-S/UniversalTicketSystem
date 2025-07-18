const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const commentsController = require('../controllers/commentsController');
const ticketsController = require('../controllers/ticketsController');
const { query, body } = require('express-validator');
const { validate } = require('../middlewares/validate');

//  Users
router.get('/users', userController.getUsers);

router.get('/user-info',
    userController.getPeersonalUserInfo);

router.get('/user-info-search',
    query('email').notEmpty().isLength({max: 250}).isEmail().withMessage('Incorrect Email Field'),
    validate,
    userController.getSpecificUserInfo);

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

//  Tickets
router.post('/ticket-create', 
    body('title').notEmpty().isLength({max: 250}).withMessage("Incorrect Title Field"),
    body('description').notEmpty().isLength({max: 5024}).withMessage("Incorrect description field"),
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
    validate,
    ticketsController.GetAllTickets);

router.get('/ticket', 
    query('ticket_id').notEmpty().isInt().withMessage("Incorrect Ticket ID"),
    validate,
    ticketsController.GetTicketInfo);

router.get('/tickets', 
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