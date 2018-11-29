var request = require('request');
var express = require('express');
var app = express();

var config = require('../config.js');
var api_url = config.api_url;

app.get('/:sourceid/timeline', function(req, res) {
    if (req.cookies.user) {
        request.get({url: api_url + '/sources/timeline', headers: {'source_id': req.params.sourceid}}, function(error, response, body) {
            if (body === '[]') {
                res.redirect('/user/subscriptions');
                return;
            }
            var entries = JSON.parse(body);
            res.render('timeline', {page_title: entries[0].source_name, entries});
        });
    } else {
        res.redirect('/user/signin');
    }
});

module.exports = app;