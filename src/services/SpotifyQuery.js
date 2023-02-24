import fetchFromSpotify, { request } from '../services/api'
import { useRecoilState } from 'recoil' //needed to manage state with recoil

//import { configLoadingAtom, genresToChooseFromAtom, artistsToChooseFromAtom, songsToChooseFromAtom } from '../recoil/atoms' //individual value you need access to

//TODO: move token to this file or global
//TODO: make setConfigLoading in component
//TODO: error handling

export const loadGenres = async (t, setGenres) => {
    //setConfigLoading(true)

    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'recommendations/available-genre-seeds'
    })
    // console.log(response)
    setGenres(response.genres)
    //setConfigLoading(false)
    return response.genres
}

//get a bunch of songs of this genre
export const loadSongs = async (t, genre) => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: `search?q=${genre}&type=track&limit=50`
    })
    // console.log("This is the genre response:")
    // console.log(response)
    return response.tracks.items
}

export const parseSongs = (songListPromise, setSongs) => {
    return songListPromise.then((songList) => {
        //console.log("songs")
        //console.log(songList)
        //console.log(songList[0])
        //console.log(destructureSong(songList[0]))
        let parsedList = songList.map(song => destructureSong(song))
        //console.log(parsedList)
        setSongs(parsedList)
    });
}

export const destructureSong = track => ({
    trackName: track.name, artist: track.artists[0].name, url: track.preview_url
})

//Should use to prevent duplicates
export const loadArtists = async (t, genre) => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: `search?q=genre%3A${genre}&type=artist`
    })
    // console.log("This is the artist response:")
    // console.log(response)
    return response.artists.items
}

export const parseArtists = (artistListPromise, setArtists) => {
    return artistListPromise.then((artistList) => {
        //console.log("songs")
        //console.log(artistList)
        //console.log(artistList[0])
        //console.log(destructureArtists(artistList[0]))
        let parsedList = artistList.map(artist => destructureArtists(artist))
        //console.log(parsedList)
        setArtists(parsedList)
    });
}

const destructureArtists = artist => (
    artist.name
)