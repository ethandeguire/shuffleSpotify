var querystring = require('querystring');

var client_id = 'f641378c46af4b80a54f0ac4411cebdd'; // Your client id
var client_secret = '66677fa7eb17447cafb128fd96d1b0db'; // Your secret
var redirect_uri = 'https://spotifyshuffle.netlify.app/callback'; // Your redirect uri

exports.handler = function (event, context, callback) {
    var state = generateRandomString(16);

    var scope = 'ugc-image-upload user-follow-read user-follow-modify user-read-recently-played user-top-read user-read-playback-position user-library-read user-library-modify user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private streaming app-remote-control user-read-email user-read-private';
    let url = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })

    console.log(url, state)

    return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            redirect: url,
            cookie: {'spotify_auth_state': state}
        })
    })

}

const generateRandomString = (length) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};