const express = require('express');
const router = express.Router();
const path = require('path');
const randomString = require('randomstring');
const fs = require('fs');
const { con } = require('../../../utils/databases/mysql');

router.post('/custom_dns/:type', async (req, res) => {
    if (req.params.type == 'add') {
        if (!req.body.host || !req.body.address) return res.json({code: 400, msg: 'Bad request'});
        con.query(`SELECT * FROM custom_dns WHERE host = '${req.body.host}'`, function (err, findRecord) {
            if (findRecord?.[0]) return res.json({code: 400, msg: 'Record exist'});
            con.query(`INSERT INTO custom_dns(id, host, address, type) VALUES (${randomString.generate({charset: 'numeric', length: 7})}, '${req.body.host}', '${req.body.address}', 'A')`, function (err) {
                if (err) return res.json({code: 500, msg: 'Failed to add'});
                return res.json({code: 200, msg: 'Added successfully'});
            })
        })
    } else if (req.params.type == 'remove') {
        if (!req.body.id) return res.json({code: 400, msg: 'Bad request'});
        con.query(`DELETE FROM custom_dns WHERE id = ${req.body.id}`, function (err) {
            if (err) return res.json({code: 500, msg: 'Failed to add'});
            return res.json({code: 200, msg: 'Added successfully'});
        })
    }
});

router.post('/block_dns/:type', async (req, res) => {
    if (req.params.type == 'add') {
        if (!req.body.host) return res.json({code: 400, msg: 'Bad request'});
        con.query(`SELECT * FROM block_dns WHERE host = '${req.body.host}'`, function (err, findRecord) {
            if (findRecord?.[0]) return res.json({code: 400, msg: 'Record exist'});
            con.query(`INSERT INTO block_dns(id, host) VALUES (${randomString.generate({charset: 'numeric', length: 7})}, '${req.body.host}')`, function (err) {
                if (err) return res.json({code: 500, msg: 'Failed to add'});
                return res.json({code: 200, msg: 'Added successfully'});
            })
        })
    } else if (req.params.type == 'remove') {
        if (!req.body.id) return res.json({code: 400, msg: 'Bad request'});
        con.query(`DELETE FROM block_dns WHERE id = ${req.body.id}`, function (err) {
            if (err) return res.json({code: 500, msg: 'Failed to add'});
            return res.json({code: 200, msg: 'Added successfully'});
        })
    }
});

router.post('/block_ip/:type', async (req, res) => {
    if (req.params.type == 'add') {
        if (!req.body.ip) return res.json({code: 400, msg: 'Bad request'});
        con.query(`SELECT * FROM block_ip WHERE host = '${req.body.host}'`, function (err, findRecord) {
            if (findRecord?.[0]) return res.json({code: 400, msg: 'Record exist'});
            con.query(`INSERT INTO block_ip(id, ip) VALUES (${randomString.generate({charset: 'numeric', length: 7})}, '${req.body.ip}')`, function (err) {
                if (err) return res.json({code: 500, msg: 'Failed to add'});
                return res.json({code: 200, msg: 'Added successfully'});
            })
        })
    } else if (req.params.type == 'remove') {
        if (!req.body.id) return res.json({code: 400, msg: 'Bad request'});
        con.query(`DELETE FROM block_ip WHERE id = ${req.body.id}`, function (err) {
            if (err) return res.json({code: 500, msg: 'Failed to add'});
            return res.json({code: 200, msg: 'Added successfully'});
        })
    }
});
module.exports = router;