var querystring = require('querystring');

var client_id = 'f641378c46af4b80a54f0ac4411cebdd'; // Your client id
var client_secret = '66677fa7eb17447cafb128fd96d1b0db'; // Your secret
var redirect_uri = 'https://spotifyshuffle.netlify.app/callback'; // Your redirect uri
var request = require('request'); // "Request" library


exports.handler = function (event, context, callback) {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token;

            // pass the token to the browser to make requests from there
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    redirect: `/index.html?access_token=${access_token}&refresh_token=${refresh_token}`
                })
            })
        }
    });

}