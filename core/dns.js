const dns = require('native-dns');
const ip = require('ip');
const server = dns.createServer();
const { lookup } = require('dns-lookup-cache');
const { con } = require('../utils/databases/mysql');
const c = require('./express');

    
server.on('request', function (request, response) {
    // console.log(request.question[0].name, request.address.address)
    
    // c.socket?.to('activeClient').emit('request', {
    //     host: request.question[0].name,
    //     requestIp: request.address.address
    // })
    // prodns.elainateam.io
    con.query(`SELECT * FROM block_ip WHERE ip = '${request.address.address}'`, function (err, findBlockIpRecord) {
        if (findBlockIpRecord?.[0]) return;
        con.query(`SELECT * FROM custom_dns WHERE host = '${request.question[0].name}'`, function (err, findRecord) {
            if (findRecord?.[0]) {
                if (findRecord[0].type == 'A') {
                    response.answer.push(dns.A({
                        name: request.question[0].name,
                        address: findRecord[0].address,
                        ttl: 600,
                    }));
                } else if (findRecord[0].type == 'AAAA') {
                    response.additional(dns.AAAA({
                        name: request.question[0].name,
                        address: findRecord[0].address,
                        ttl: 300,
                    }));
                }
                setTimeout(() => {
                    return response.send();
                }, 800)
            } else {
                con.query(`SELECT * FROM block_dns WHERE host = '${request.question[0].name}'`, function (err, findBlockDnsRecord) {
                    if (findBlockDnsRecord?.[0]) return;

                    lookup(request.question[0].name, {
                        family: 4
                    }, (error, address, family) => {
                        response.answer.push(dns.A({
                            name: request.question[0].name,
                            address: address,
                            ttl: 600,
                        }));

                    });
                    lookup(request.question[0].name, {
                        family: 6
                    }, (error, address, family) => {
                        response.additional.push(dns.AAAA({
                            name: request.question[0].name,
                            address: address,
                            ttl: 300,
                        }));
                    });
                    setTimeout(() => {
                        return response.send();
                    }, 800)
                })
            }
        })
    })
});


server.on('error', function (err, buff, req, res) {
    console.log(err.stack);
});
server.serve(53, ip.address())
console.log(`> DNS Server is working`);
process.on('uncaughtException', (err) => {
    // return console.log(err)
});
process.on('unhandledRejection', (err) => {
    // return console.log(err)
});