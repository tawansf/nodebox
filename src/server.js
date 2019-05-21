'use strict';

/**
 * Created by Tawan Silva on 16/05/19
 * tawan.sf.99@gmail.com
 */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const conn = require('../config.json');

const app = express();
app.use(cors());

// Socket.io

const server = require('http').Server(app)
const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    });
});

// Mongo

mongoose.connect(conn.db, {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

app.use(require('./routes'));

server.listen(process.env.PORT || 3000);