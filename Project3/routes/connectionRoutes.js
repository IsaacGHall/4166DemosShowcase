const { response } = require('express');
const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const{validateId, validateConnection} = require('../middlewares/validator');
const router = express.Router();


//again, cannibalized and modified from module 6, but best I source it just to be safe, I hope this is ok.
//I kind of rewatched the videos on all of the sourced code and added it iteratively over time. but still:
//<Lijuan Cao> (<unknown>) <storyRoutes.js> (<1.0.0>) [Javascript].
router.get('/', controller.indexPage);
router.get('/new', isLoggedIn, controller.newPost);
router.post('/', isLoggedIn, validateConnection, controller.createPost);
router.get('/:id', validateId, controller.show);
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.editPost);
router.put('/:id', validateId, isLoggedIn, isAuthor, validateConnection, controller.updatePost); 
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.deletePost); 
router.post('/:id/rsvp', isLoggedIn, controller.createRSVP);

module.exports = router;