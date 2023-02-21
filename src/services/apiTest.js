import fetchFromSpotify from './services/api'

export const testLoadGenres = async t => {
    //setConfigLoading(true)
    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'recommendations/available-genre-seeds'
    })
    console.log(response)
        //setGenres(response.genres)
        //setConfigLoading(false)
}

export const testGetrecomendations = async t => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'recommendations?limit=10&seed_genres=rock'
    })
    console.log(response)
}

//only gives catagory info
export const testGetBrowse = async t => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'browse/categories/rock'
    })
    console.log(response)
}

//Important: should use search to get most popular tracks,
//and other popular artists in genre

//To get artists: search?q=genre%3Arock&type=artist
//To get songs: search?q=genre%3Arock&type=track
export const testSearch = async t => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'search?q=genre%3Arock&type=track'
    })
    console.log(response)
}

export const testGetSong = async t => {
    const response = await fetchFromSpotify({
        token: t,
        endpoint: 'tracks/4erreiEs3eQbvqjTUcuVrV'
    })
    console.log(response)
}