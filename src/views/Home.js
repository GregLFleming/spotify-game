import React, { useEffect } from 'react'
import Roll from 'react-reveal/Roll';
import Flip from 'react-reveal/Flip';
import Header from '../components/Header.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Select from '../components/Select.jsx'
import { selectNArtists, getRandomSong } from '../services/helpers';
import homeStyles from '../styles/homeStyles.css';
import records from '../assets/records.jpg';
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadArtists, loadGenres, loadSongs, parseArtists, parseSongs } from '../services/SpotifyQuery.js'
import { request } from '../services/api'
import { maxLivesAtom, roundNumberAtom, popupAtom, gameOverAtom, songToGuessAtom, artistChoicesAtom, artistsToChooseFromAtom, songsToChooseFromAtom, timeLimitAtom, timeRemainingAtom, qtySongsAtom, qtyArtistsChosenAtom, genreSelectedAtom, genresToChooseFromAtom, tokenAuthorizationLoadingAtom, configLoadingAtom, tokenAtom, livesRemainingAtom } from '../recoil/atoms' //individual value you need access to
import { NavLink } from 'react-router-dom'

const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token'
const TOKEN_KEY = 'whos-who-access-token'

const Home = () => {

  //---------Recoil State Storage---------\\
  //API Fetch
  const [configLoading, setConfigLoading] = useRecoilState(configLoadingAtom)
  const [genres, setGenres] = useRecoilState(genresToChooseFromAtom)
  const [authLoading, setAuthLoading] = useRecoilState(tokenAuthorizationLoadingAtom)
  const setToken = useSetRecoilState(tokenAtom)

  //User Inputs
  const [selectedGenre, setSelectedGenre] = useRecoilState(genreSelectedAtom)
  const [maxLives, setMaxLives] = useRecoilState(maxLivesAtom);
  const [qtyArtistsChosen, setQtyArtistsChosen] = useRecoilState(qtyArtistsChosenAtom)
  const [qtySongs, setQtySongs] = useRecoilState(qtySongsAtom)

  //Game State
  const [songs, setSongs] = useRecoilState(songsToChooseFromAtom)
  const [artists, setArtists] = useRecoilState(artistsToChooseFromAtom)
  const setArtistChoices = useSetRecoilState(artistChoicesAtom)
  const setSongToGuess = useSetRecoilState(songToGuessAtom)
  const setRoundNumber = useSetRecoilState(roundNumberAtom)
  const setPopup = useSetRecoilState(popupAtom)
  const setGameOver = useSetRecoilState(gameOverAtom);
  const setLivesRemaining = useSetRecoilState(livesRemainingAtom)

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
        parseSongs(loadSongs(storedToken.value, selectedGenre), setSongs)
        parseArtists(loadArtists(storedToken.value, selectedGenre), setArtists)
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
      parseSongs(loadSongs(storedToken.value, selectedGenre), setSongs)
      parseArtists(loadArtists(storedToken.value, selectedGenre), setArtists)
    })
  }, [selectedGenre])

  //Initialize the state for a new game
  const prepareNewGame = () => {
    const songToGuessIntermediate = getRandomSong(songs)
    setRoundNumber(1);
    setLivesRemaining(maxLives);
    setSongToGuess(songToGuessIntermediate)
    setArtistChoices(selectNArtists(qtyArtistsChosen, artists, songToGuessIntermediate));
    setGameOver(false);
    setPopup('');
  }

  if (authLoading || configLoading) {
    return <div>Loading...</div>
  }

  //---------JSX---------\\
  return (
    <div>
      <Container>
        <img src={records} alt='Picture of Record' />

        <Header><Roll right>Welcome To Whos-Who</Roll></Header>
        <Flip left>
          <Card>
            <Select
              value={selectedGenre}
              onChange={event => setSelectedGenre(event.target.value)}
            >
              <option key="0" value="">Select Your Genre</option>

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
              <option key="0" value="0">Number of Artist Choices</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </Select>
            <Select
              value={qtySongs}
              onChange={event => setQtySongs(event.target.value)}
            >
              <option key="0" value="0"> Number of Songs </option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </Select>
            <Select
              value={maxLives}
              onChange={event => setMaxLives(event.target.value)}
            >
              <option key="0" value="0">How many lives?</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Select>
            {selectedGenre !== "" && qtyArtistsChosen !==0 && qtySongs !== 0 && maxLives !== 0 ? (
              <NavLink to="/game" style={{ textDecoration: 'none' }}><Button style={{ backgroundColor: '#49A078' }} onClick={prepareNewGame}>START</Button></NavLink>
            ) : (
              <NavLink to="/game" style={{ textDecoration: 'none' }}><Button disabled={true} style={{ backgroundColor: '#49A078' }} onClick={prepareNewGame}>START</Button></NavLink>
            )}
            
          </Card>
        </Flip>
      </Container>
    </div>
  )
}

export default Home
