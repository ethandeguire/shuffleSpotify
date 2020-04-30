var querystring = require('querystring');

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

    callback(null, {
        statusCode: 200,
        body: {
            redirect: url,
            cookie: {'spotify_auth_state': state}
        }
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