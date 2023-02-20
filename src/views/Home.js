import React, { useEffect } from 'react'
import Header from '../components/Header.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Select from '../components/Select.jsx'

import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { genreSelectedAtom, genresToChooseFromAtom, tokenAuthorizationLoadingAtom, configLoadingAtom, tokenAtom, songsToChooseFromAtom } from '../recoil/atoms' //individual value you need access to
import { loadGenres, loadSongs, parseSongs } from '../services/SpotifyQuery.js'
import { request } from '../services/api'


const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token'
const TOKEN_KEY = 'whos-who-access-token'

const Home = () => {
  //---------React State Storage---------\\
  // const [genres, setGenres] = useState([])
  // const [selectedGenre, setSelectedGenre] = useState('')
  // const [authLoading, setAuthLoading] = useState(false)
  // const [configLoading, setConfigLoading] = useState(false)
  // const [token, setToken] = useState('')

  //---------Recoil State Storage---------\\
  const [genres, setGenres] = useRecoilState(genresToChooseFromAtom)
  const [selectedGenre, setSelectedGenre] = useRecoilState(genreSelectedAtom)
  const [authLoading, setAuthLoading] = useRecoilState(tokenAuthorizationLoadingAtom)
  const [configLoading, setConfigLoading] = useRecoilState(configLoadingAtom)
  const [token, setToken] = useRecoilState(tokenAtom)
  const [songs, setSongs] = useRecoilState(songsToChooseFromAtom)

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

  return (
    <div>
      <Container>
        <Header>Welcome To Whos-Who</Header>
        <Card>
          <Select
            value={selectedGenre}
            onChange={event => {
              setSelectedGenre(event.target.value)
            }}
          >
            <option value='' >Select Your Genre</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>
          <Select value={songs}>
            <option value='' >Artist Choices</option>
            {songs.map(song => (
              <option key={song.name} value={song}>
                {song.name}
              </option>
            ))}
          </Select>
          <Select>
            <option value={''}> Number of Songs </option>

            <option>

            </option>

          </Select>

          <Button>START</Button>
        </Card>
      </Container>
    </div>
  )
}

export default Home
