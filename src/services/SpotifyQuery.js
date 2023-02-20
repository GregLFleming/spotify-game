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
    console.log(response)
    setGenres(response.genres)
    //setConfigLoading(false)
    return response.genres
}

export const loadSongs = async (t, genre) => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: `search?q=genre%3A${genre}&type=track`
    })
    console.log(response)
    return response.tracks.items
}

export const parseSongs = (songListPromise, setSongs) => {
    return songListPromise.then((songList) => {
        //console.log("songs")
        //console.log(songList)
        //console.log(songList[0])
        console.log(destructureSongs(songList[0]))
        setSongs(songList)
    });
}

const destructureSongs = track => ({
    trackName: track.name, artist: track.artists[0].name, url: track.preview_url
})

//Should use to prevent duplicates
export const loadArtists = async (t, genre) => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: `search?q=genre%3A${genre}&type=artist`
    })
    console.log(response)
    //setArtists(response.artists)
}