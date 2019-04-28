const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/authentication');

    
//Authentication
router.get('/principal', ensureAuthenticated, (req, res, next) => {
    res.render ('principal', {
        user: req.user
    })
});

module.exports = router;
