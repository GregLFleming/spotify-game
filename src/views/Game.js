
import React, {useRef, useEffect, useState} from 'react'

import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import styled from "styled-components"
import  {displayNumArtists, playSong}  from '../services/helpers';
import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { qtyArtistsChosenAtom, songToGuessAtom, livesRemainingAtom, roundNumberAtom, secondsRemainingAtom, artistsToChooseFromAtom, timeLimitAtom, timeRemainingAtom } from '../recoil/atoms'
import fetchFromSpotify from '../services/api.js'
import { loadArtists, parseArtists } from '../services/SpotifyQuery.js'
import { async } from 'regenerator-runtime'
import { initial } from 'lodash'
import ResultPopup from '../components/ResultPopup.jsx'

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
  const [timeRemaining, setTimeRemaining] = useRecoilState(timeRemainingAtom)
  const [timeLimit, setTimeLimit] = useRecoilState(timeLimitAtom)
  const [qtyArtistsChosen, setQtyArtistsChosen] = useRecoilState(qtyArtistsChosenAtom)
  const [songToGuess, setSongToGuess] = useRecoilState(songToGuessAtom)
  const [chosenArtists, setChosenArtists] = useRecoilState(artistsToChooseFromAtom)
  const [artists, setArtists] = useRecoilState(artistsToChooseFromAtom)

  const [popup, setPopup] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  
  useEffect(() => {
    if(timeRemaining <= 0){
      setGameOver(!gameOver)
    }
    if(livesRemaining < 1){
      setGameOver(!gameOver)
    }
  },[setGameOver])
  
  useEffect(() => {
    if(gameOver){
      setPopup(!popup)
    }
  },[setPopup]);

  useEffect(() => {
    const artists = JSON.parse(localStorage.getItem('artists'))
    if(artists){
      setArtists(artists.items.name)
    }
  })

//---------Timer Code---------\\
const Ref = useRef(null);
useEffect(() => {clearTimer(getDeadTime())}, []);

const getTimeRemaining = (e) => {
  const total = Date.parse(e) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  return {seconds};
}

const startTimer = (e) => {
  let { seconds } = getTimeRemaining(e);
  if (seconds >= 0) {
    setTimeRemaining(seconds)
  }
}

const clearTimer = (e) => {
  setTimeRemaining(timeLimit);

  if (Ref.current) clearInterval(Ref.current);
  const id = setInterval(() => {
    startTimer(e);
  }, 1000)
  Ref.current = id;
}

const getDeadTime = () => {
  let deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + timeLimit);
  return deadline;
}


const onClickReset = () => {
  clearTimer(getDeadTime());
}
const handlePlaySong = (url) => {
  onClickReset()
  playSong(url)
}


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
                  {
                    artists.map((artist, index) =>{
                      return(
                        <Button key={index} style={{ margin: '10px' }} id={index}>{artist}</Button>
                      )
                    })
                  }
                  {/* <div style={{ margin: '10px' }} id={index} value={artists.map(artist => artist)}>{[...Array(artists)].map((a, i) => <Button key={i}></Button>)}</div> */}
                </GridItem>))}
          </GridContainer>
          <Button onClick = {handlePlaySong}>PLAY SONG</Button>
          <span style={{ display: 'flex', flexDirection: 'row' }}>
            <Button style={{ marginRight: '220px', cursor: 'default' }}>Lives Remaining: {livesRemaining}</Button>
            <Button style={{cursor: 'default'}}>Time remaining: {timeRemaining}</Button>
          </span>
          
          <ResultPopup>
            <h2>You Win / Lose!!!</h2> <br/>
            <span style={{display: "flex"}}>
              <Button style={{marginRight: '50px'}}>Return to Menu</Button>
              <Button>Try Again</Button>
            </span>
          </ResultPopup>
          
          {/* {
            !gameOver ? <ResultPopup>You Lose</ResultPopup> : <ResultPopup>
            </ResultPopup>
          } */}
        {/* {
          !popup &&
          <ResultPopup></ResultPopup>
        }
        {
          popup &&
          <ResultPopup>YOU LOSE!</ResultPopup>
        } */}
        </Card>
      </Container>
    </div>
  )
}

export default Game