import fetchFromSpotify, { request } from '../services/api'

export const loadGenres = async t => {
    setConfigLoading(true)
    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'recommendations/available-genre-seeds'
    })
    console.log(response)
    //setGenres(response.genres)
    setConfigLoading(false)
}
export const loadArtists = async t => {
    setConfigLoading(true)
    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'search?q=genre%3Arock&type=artist'
    })
    console.log(response)
    //setGenres(response.genres)
        setConfigLoading(false)
}