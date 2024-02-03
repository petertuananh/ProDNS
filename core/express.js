const express = require('express');
const app = express();
const config = require('../config.json');
const path = require('path');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
const ip = require('ip');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views/pages'));
app.use("/assets", express.static(path.resolve(`${process.cwd()}${path.sep}views${path.sep}assets`)));
app.use('/', require('../routers'));

const http = createServer(app);
const io = new socketIo.Server(http, {
    cors: {
        origin: "*",
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
});

http.listen(config.server.port || config.server.defaultPort, () => {
    console.log(`> WEB Server is working`)
    console.log(`> Dashboard: http://${ip.address()}:${config.server.port || config.server.defaultPort}`)
});

// io.on('connection', (socket) => {
//     socket.join('activeClient');
// })