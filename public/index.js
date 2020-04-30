let playlistSongs = []
let shuffledSongs = []
let deviceID = ""

const getDevices = (access_token) => {
    return fetch('https://api.spotify.com/v1/me/player/devices', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        })
        .then(response => response.json())
        .then(res => {
            return res.devices
        })
}

const addSongToQueue = (access_token, deviceID, songURI) => {
    return fetch(`https://api.spotify.com/v1/me/player/queue?uri=${songURI}&device_id=${deviceID}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
}

const getAllofSomething = (access_token, fetchURL, list = []) => {
    return fetch(fetchURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        })
        .then(response => response.json())
        .then(res => {
            list.push(...res["items"])
            if (res["next"]) return getAllofSomething(access_token, res["next"], list)
            else return list
        })
}

const getAllSavedSongs = (access_token) => {
    return getAllofSomething(access_token, 'https://api.spotify.com/v1/me/tracks')
}

const getAllPlaylists = (access_token) => {
    return getAllofSomething(access_token, 'https://api.spotify.com/v1/me/playlists')
}

const getSplicedSavedSongs = (access_token, numberToQueue) => {
    return getAllSavedSongs(access_token)
        .then(songs => songs.splice(0, numberToQueue))
}

const shuffleSongs = (songs, poolSize = 2) => {
    // console.log(songs, poolSize)

    let pool = []
    let outputList = []

    // initialize pool
    for (let i = 0; i < poolSize; i++) {
        pool.push(songs[i])
    }

    for (let i = poolSize; i < songs.length + poolSize; i++) {

        // pick random from pool
        let index = Math.floor(Math.random() * pool.length)
        outputList.push(pool[index])
        pool.splice(index, 1)

        // add to pool if possible
        if (i < songs.length) pool.push(songs[i])

    }

    return outputList
}

const importPlaylist = (access_token, playlistID) => {
    showLoader(true)
    return getAllofSomething(access_token, `https://api.spotify.com/v1/playlists/${playlistID}/tracks`)
        .then(tracks => {
            playlistSongs = tracks.splice(0, numberOfSongsHTML.value)
            showLoader(false)
        })
}

const displayPlaylist = () => {
    beforeShuffle.innerHTML = ''

    for (let i = 0; i < playlistSongs.length; i++) {
        beforeShuffle.innerHTML += formatSong(playlistSongs[i])
    }

    return true
}

const displayShuffled = () => {
    afterShuffle.innerHTML = ''

    for (let i = 0; i < shuffledSongs.length; i++) {
        afterShuffle.innerHTML += formatSong(shuffledSongs[i])
    }

    return true
}

const playlistImportButton = (access_token, playlistID) => {
    importSongsModal.style.display = 'none';
    showLoader(true)

    return importPlaylist(access_token, playlistID)
        .then(success => {
            showLoader(false)
            displayPlaylist(access_token)
        })

}

const queueShuffledSongsFromLibrary = (access_token, numberToQueue, poolSize) => {
    let deviceID = getDevices(access_token)
        .then(devices => devices[0]['id'])

    let getShuffledSplicedSongs = getAllSavedSongs(access_token)
        .then(songs => {
            // console.log(`Original Songs: ${songs}`);
            return songs.splice(0, numberToQueue)
        })
        .then(songs => {
            // console.log(`Spliced Songs: ${songs}`)
            return shuffleSongs(songs, poolSize)
        })

    // console.log(deviceID, getShuffledSplicedSongs)

    Promise.all([deviceID, getShuffledSplicedSongs])
        .then(arr => {
            return queueManySongs(access_token, arr[1], arr[0])
        })
        .then(res => console.log(res))

}

const queueManySongs = (access_token, songs, deviceID) => {
    console.log(access_token)
    console.log(songs)
    console.log(deviceID)

    return songs.reduce((previousPromise, song) => {
        return previousPromise.then(() => {
            // console.log(access_token, deviceID, song["track"]["uri"])
            return addSongToQueue(access_token, deviceID, song["track"]["uri"])
        })
    }, Promise.resolve())
}

const formatSong = (song) => {
    let artists = ""
    song["track"]["artists"].forEach(artist => artists += `${artist["name"]}, `)

    return `
        <a class="spoLink" href=${song["track"]["external_urls"]["spotify"]} target="none">  
            <div class="formattedSong ">
                <div class="trackName">${song["track"]["name"]}</div>
                <div class="trackArtists">${artists.substr(0, artists.length-2)}</div>
            </div>
        </a>
    `
}

const queueSongs = () => {
    console.log("called")
    return queueManySongs(access_token, shuffledSongs, deviceID)
}

const showLoader = (bool) => {
    document.getElementById('loadingModal').style.display = bool ? 'block' : 'none'
}

const clickDevice = (deviceIDtemp) => {
    showLoader(true)
    deviceID = deviceIDtemp
    document.getElementById('deviceSelectModal').style.display = 'none'
    queueSongs()
        .then(res => {
            showLoader(false);
            document.getElementById('queueSucessModal').style.display = "block"
        })
}

const errorModal = message => {
    errorModalMessageHTML.innerHTML = message
    errorModalHTML.style.display='block'
}