
import React, { useRef, useEffect, useState } from 'react'

import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import styled from "styled-components"
import { playSong, getRandomSong } from '../services/helpers';
import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { qtySongsAtom, gameStatusAtom, artistChoicesAtom, songsToChooseFromAtom, qtyArtistsChosenAtom, songToGuessAtom, livesRemainingAtom, roundNumberAtom, secondsRemainingAtom, artistsToChooseFromAtom, timeLimitAtom, timeRemainingAtom } from '../recoil/atoms'
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

const ResultScreen = styled.div`{}
border: 2px solid black;
position: absolute;
width: 40vw;
height: 60vh;
// background: black;
`

const randomizer = (arr, count) => arr.sort(() => Math.random() - 0.5).slice(0, count);


const Game = () => {
  //---------Recoil State Storage---------\\
  const [livesRemaining, setLivesRemaining] = useRecoilState(livesRemainingAtom)
  const [roundNumber, setRoundNumber] = useRecoilState(roundNumberAtom)
  const [timeRemaining, setTimeRemaining] = useRecoilState(timeRemainingAtom)
  const [timeLimit, setTimeLimit] = useRecoilState(timeLimitAtom)
  const [qtyArtistsChosen, setQtyArtistsChosen] = useRecoilState(qtyArtistsChosenAtom)
  const [songToGuess, setSongToGuess] = useRecoilState(songToGuessAtom)
  const [chosenArtists, setChosenArtists] = useRecoilState(artistsToChooseFromAtom)
  const [songsToChooseFrom, setSongsToChooseFrom] = useRecoilState(songsToChooseFromAtom)
  const [artistChoices, setArtistChoices] = useRecoilState(artistChoicesAtom)
  const [gameStatus, setGameStatus] = useRecoilState(gameStatusAtom)
  const [qtySongs, setQtySongs] = useRecoilState(qtySongsAtom )


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
      randomizer(artistResponse.chosenArtists, config.retrievedArtists - 1).map((a) => ({ correct: false, a })).concat([{ correct: true, artistRequest }]).sort(() => Math.random() - 0.5)
    )
  }

  //---------Timer Code---------\\
  const Ref = useRef(null);
  useEffect(() => { timer.reset }, []);

  const timer = {
    start: function (timeOut) {
      const total = Date.parse(timeOut) - Date.parse(new Date());
      const seconds = Math.floor((total / 1000) % 60);
      if (seconds >= 0) {
        setTimeRemaining(seconds)
      }
    },

    reset: function () {
      let timeOut = new Date();
      
      timeOut.setSeconds(timeOut.getSeconds() + timeLimit);
      setTimeRemaining(timeLimit);

      if (Ref.current){
        clearInterval(Ref.current);
      }
      const id = setInterval(() => {this.start(timeOut)}, 1000)
      Ref.current = id;
    }
  }

  const handlePlaySong = (url) => {
    timer.reset()
    // playSong(url)
  }
  //---------Game Logic---------\\
  const startNewRound = () => {
    setSongToGuess(getRandomSong(songsToChooseFrom))
    // setArtistChoices(selectNArtists(qtyArtistsChosen, chosenArtists))
    timer.reset();
  }

  //monitor game state
  useEffect(() => {
    if(livesRemaining < 1 || timeRemaining < 1){
      setGameStatus("You Lose!!!")
    }
    else if(roundNumber > qtySongs){
      setGameStatus("You Win!!!")
    }
    else{
      setGameStatus("")
    }

  
  }, [timeRemaining]);


  //---------JSX---------\\
  return (
    <div>
      <Container>
          <Header>Round {roundNumber}</Header>
          <Card>
            <GridContainer>
              {[...Array(parseInt(qtyArtistsChosen)),]
                .map((value, index) => (
                  <GridItem key={index}>
                    <Button style={{ margin: '10px' }} id={index}>ArtistNameHere {index + 1}</Button>
                  </GridItem>))}
            </GridContainer>
            <Button onClick={handlePlaySong}>PLAY SONG</Button>
            <span style={{ display: 'flex', flexDirection: 'row' }}>
              <Button style={{ marginRight: '220px' }}>Lives Remaining: {livesRemaining}</Button>
              <Button>Time remaining: {timeRemaining}</Button>
            </span>
          </Card>
        </Container> 
    </div>
  )
}

export default Game