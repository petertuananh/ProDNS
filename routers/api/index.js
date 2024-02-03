const express = require('express');
const router = express.Router();
const path = require('path');
const functions = require('../../utils/functions');
const fs = require('fs');
router.use('/auth', require('./auth'));
router.use('/wizard', require('./wizard'));
router.use('/config', functions.express.authentication.ensureAuthenticated, require('./config'));

module.exports = router;