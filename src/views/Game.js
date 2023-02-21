import React, { useState } from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import styled from "styled-components"
import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { qtyArtistsChosenAtom, songToGuessAtom, livesRemainingAtom, roundNumberAtom, secondsRemainingAtom, artistsToChooseFromAtom } from '../recoil/atoms'
import fetchFromSpotify from '../services/api.js'
import { async } from 'regenerator-runtime'
import { initial } from 'lodash'

const ARTIST_KEY = "artistKey"

//----------------Styling----------------\\
const GridContainer = styled.div`{}
margin: 20px auto;
display:grid;
grid-template-columns: 200px 200px;
grid-row: auto auto;
grid-column-gap: 20px;
grid-row-gap: 20px;
`
const GridItem = styled.div`{}
border-radius:10px;
display:flex;
align-items:center;
justify-content:center;
`

const randomizer = (arr, count) => arr.sort(() => Math.random() -0.5).slice(0, count);
  

const Game = () => {
  //---------Recoil State Storage---------\\
  const [livesRemaining, setLivesRemaining] = useRecoilState(livesRemainingAtom)
  const [roundNumber, setRoundNumber] = useRecoilState(roundNumberAtom)
  const [secondsRemaining, setSecondsRemaining] = useRecoilState(secondsRemainingAtom)
  const [qtyArtistsChosen, setQtyArtistsChosen] = useRecoilState(qtyArtistsChosenAtom)
  const [songToGuess, setSongToGuess] = useRecoilState(songToGuessAtom)
  const [chosenArtists, setChosenArtists] = useRecoilState(artistsToChooseFromAtom)

  const [config, setConfig] = useState({
    retrievedArtists: Number.parseInt(
      JSON.parse(localStorage.getItem(ARTIST_KEY))
    )
  })

  const getArtists = async () => {
    const artistRequest = await fetchFromSpotify({
      token,
      endpoint: `artists/${songToGuess.chosenArtists[0].id}`
    });

    const artistResponse = await fetchFromSpotify({
      token,
      endpoint: `artists/${songToGuess.chosenArtists[0].id}/related-artists`,
    });
    setChosenArtists(
      randomizer(artistResponse.chosenArtists, config.retrievedArtists -1).map((a) => ({correct: false, a})).concat([{correct: true, artistRequest}]).sort(() => Math.random() -0.5)
    )
  }

  return (
    <div>
      <Container>
        <Header>Round {roundNumber}</Header>
        <Card>
          <GridContainer>
            {[...Array(parseInt(qtyArtistsChosen)),]
              .map((value, index) => (
                <GridItem>
                  <Button style={{ margin: '10px' }} id={index} key={index}>ArtistNameHere {index + 1}</Button>
                </GridItem>))}
          </GridContainer>

          {/* <span style={{ display: 'flex', flexDirection: 'row' }}>
            <Button style={{ margin: '25px' }}>Artist 1</Button>
            <Button style={{ margin: '25px' }}>Artist 2</Button>
          </span>
          <span style={{ display: 'flex', flexDirection: 'row' }}>
            <Button style={{ margin: '25px' }}>Artist 3</Button>
            <Button style={{ margin: '25px' }}>Artist 4</Button>
          </span> */}
          <Button>PLAY SONG</Button>
          <span style={{ display: 'flex', flexDirection: 'row' }}>
            <Button style={{ marginRight: '220px' }}>Lives Remaining: {livesRemaining}</Button>
            <Button>Time remaining: {secondsRemaining} {qtyArtistsChosen}</Button>
          </span>
        </Card>
      </Container>
    </div>
  )
}

export default Game