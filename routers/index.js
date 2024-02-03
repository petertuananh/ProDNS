const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config.json');
const functions = require('../utils/functions');
const { con } = require('../utils/databases/mysql');

const fs = require('fs');
router.use('/api', require('./api'));
router.use('/auth', require('./auth'));
router.get('/', functions.express.authentication.ensureAuthenticated, async (req, res) => {
    con.query(`SELECT * FROM user`, function (err, user) {
        con.query(`SELECT * FROM user_sessions`, function (err, user_sessions) {
            con.query(`SELECT * FROM custom_dns`, function (err, custom_dns) {
                con.query(`SELECT * FROM block_dns`, function (err, block_dns) {
                    con.query(`SELECT * FROM block_ip`, function (err, block_ip) {
                        return res.render('index', {
                            req,
                            user,
                            user_sessions,
                            custom_dns,
                            block_dns,
                            block_ip
                        });
                    });
                });
            });
        });
    });
});
router.get('/wizard', async (req, res) => {
    if (config.status.isWizarded) return res.render('error/403');
    return res.render('wizard');
});
module.exports = router;