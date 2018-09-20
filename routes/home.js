var config = require('../config.js');
var api_url = config.api_url;

var request = require('request');

exports.index = function(req, res) {
    request.get(api_url + '/entries/20', function(error, response, body) {
        var entries = JSON.parse(body);
        request.get(api_url + '/sources', function(error, response, body) {
            var sources = JSON.parse(body);
            entries.forEach(element => {
                element.source_name = sources[element.source_id-1].name;
            });
            res.render('index', {entries})
        });
    });
};