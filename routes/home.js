var request = require('request');
var express = require('express');
var app = express();

var config = require('../config.js');
var api_url = config.api_url;

app.get('/', function(req, res) {
    if (req.cookies.user) {
        request.get(api_url + '/entries/20', function(error, response, body) {
            var entries = JSON.parse(body);
            request.get(api_url + '/sources', function(error, response, body) {
                var sources = JSON.parse(body);
                entries.forEach(element => {
                    for (var source of sources) {
                        if (source.id === element.source_id) {
                            element.source_name = source.name;
                        }
                    }
                });
                res.render('index', {entries})
            });
        });
    } else {
        res.redirect('/user/signin');
    }
});

module.exports = app;