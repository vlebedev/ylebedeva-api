'use strict';

let express = require('express');
let app = require('express')();
let srv = require('http').createServer(app);
let bodyParser = require('body-parser');
let path = require('path');
let request = require('request');
let fs = require('fs');
let zlib = require('zlib');
let async = require('async');

let media = [];
let profile = {};

app.get('/profile', (req, res, next) => {
    res.send(profile);
});

app.get('/media', (req, res, next) => {
    res.send(media);
});

async.waterfall([

    (callback) => {
        fs.readFile('./ylebedeva.json.gz', callback);
    },

    (data, callback) => {
        zlib.gunzip(data, callback);
    },

    (data, callback) => {
        media = JSON.parse(data);

        request({ 
            url: 'https://instagram.com/ylebedeva/?__a=1',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)'+
                              ' Chrome/59.0.3071.115 Safari/537.36'
            }
        }, callback);
    },

    (res, body, callback) => {
        let json = JSON.parse(body);
        delete json.user.media;
        delete json.user.saved_media;
        profile = json.user;

        srv.listen(3000, callback);
    },

    (callback) => {
        console.log('Listening on 3000');        
    }
    
]);
