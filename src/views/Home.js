import React, { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import Card from '../components/Card.jsx'
import fetchFromSpotify, { request } from '../services/api'
import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'
import Select from '../components/Select.jsx'

const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token'
const TOKEN_KEY = 'whos-who-access-token'

const Home = () => {
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [token, setToken] = useState('')

  const loadGenres = async t => {
    setConfigLoading(true)
    const response = await fetchFromSpotify({
      token: t,
      endpoint: 'recommendations/available-genre-seeds'
    })
    console.log(response)
    setGenres(response.genres)
    setConfigLoading(false)
  }

  useEffect(() => {
    setAuthLoading(true)

    const storedTokenString = localStorage.getItem(TOKEN_KEY)
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString)
      if (storedToken.expiration > Date.now()) {
        console.log('Token found in localstorage')
        setAuthLoading(false)
        setToken(storedToken.value)
        loadGenres(storedToken.value)
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
      loadGenres(newToken.value)
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
        onChange={event => setSelectedGenre(event.target.value)}
      >
        <option value='' >Select Your Genre</option>
        {genres.map(genre => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </Select>
      <Select>
        <option value={''}>Artist Choices</option>
        
          <option>
            
          </option>
        
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