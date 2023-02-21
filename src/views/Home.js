import React, { useEffect, useRef } from 'react'
import Header from '../components/Header.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Select from '../components/Select.jsx'

import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { loadArtists, loadGenres, loadSongs, parseArtists, parseSongs } from '../services/SpotifyQuery.js'
import { request } from '../services/api'

import { artistsToChooseFromAtom, songsToChooseFromAtom, timeLimitAtom, timeRemainingAtom, qtySongsAtom, qtyArtistsChosenAtom, genreSelectedAtom, genresToChooseFromAtom, tokenAuthorizationLoadingAtom, configLoadingAtom, tokenAtom } from '../recoil/atoms' //individual value you need access to
import { NavLink } from 'react-router-dom'
// import { startCountDownTimer } from '../services/helpers.js'


//this is a change

const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token'
const TOKEN_KEY = 'whos-who-access-token'

const Home = () => {

  //---------Recoil State Storage---------\\
  const [genres, setGenres] = useRecoilState(genresToChooseFromAtom)
  const [selectedGenre, setSelectedGenre] = useRecoilState(genreSelectedAtom)
  const [authLoading, setAuthLoading] = useRecoilState(tokenAuthorizationLoadingAtom)
  const [configLoading, setConfigLoading] = useRecoilState(configLoadingAtom)
  const [token, setToken] = useRecoilState(tokenAtom)
  const [songs, setSongs] = useRecoilState(songsToChooseFromAtom)
  const [artists, setArtists] = useRecoilState(artistsToChooseFromAtom)
  const [qtyArtistsChosen, setQtyArtistsChosen] = useRecoilState(qtyArtistsChosenAtom)
  const [qtySongs, setQtySongs] = useRecoilState(qtySongsAtom )
  const [timeRemaining, setTimeRemaining] = useRecoilState(timeRemainingAtom)
  const [timeLimit, setTimeLimit] = useRecoilState(timeLimitAtom)
  
  //---------Initial Loading---------\\
  useEffect(() => {
    setAuthLoading(true)

    const storedTokenString = localStorage.getItem(TOKEN_KEY)
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString)
      if (storedToken.expiration > Date.now()) {
        console.log('Token found in localstorage')
        setAuthLoading(false)
        setToken(storedToken.value)

        //problem is returns promise and loading var doesn't wait
        //setConfigLoading(false)
        loadGenres(storedToken.value, setGenres)
        //setConfigLoading(false)
        parseSongs(loadSongs(storedToken.value, "rock"), setSongs)
        parseArtists(loadArtists(storedToken.value, "rock"), setArtists)
        return
      }
    }
    console.log('Sending request to AWS endpoint')
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken))
      setAuthLoading(false)
      setToken(newToken.value)
      loadGenres(newToken.value, setConfigLoading, setGenres)
    })
  }, [])

  if (authLoading || configLoading) {
    return <div>Loading...</div>
  }
  

  //---------JSX---------\\
  return (
    <div>
      <Container>
        <Header>Welcome To Whos-Who</Header>
        <Card>
          <Select
            value={selectedGenre}

            onChange={event => setSelectedGenre(event.target.value)}
          >
            <option value='' disabled>Select Your Genre</option>

            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>

          <Select
            value={qtyArtistsChosen}
            onChange={event => setQtyArtistsChosen(event.target.value)}
          >
            <option value='2' disabled>Artist Choices</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </Select>
          <Select
          value={qtySongs}
          onChange={event => setQtySongs(event.target.value)}
          >
            <option value='1' disabled> Number of Songs </option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </Select>
          <NavLink to="/game"><Button>START</Button></NavLink>
        </Card>
      </Container>
    </div>
  )
}

export default Home
