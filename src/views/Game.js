
import React, { useRef, useEffect, useState } from 'react'

import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import styled from "styled-components"
import { displayNumArtists, playSong, selectNArtists, getRandomSong } from '../services/helpers';
import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { maxLivesAtom, gameOverAtom, popupAtom, qtySongsAtom, gameStatusAtom, artistChoicesAtom, songsToChooseFromAtom, qtyArtistsChosenAtom, songToGuessAtom, livesRemainingAtom, roundNumberAtom, secondsRemainingAtom, artistsToChooseFromAtom, timeLimitAtom, timeRemainingAtom } from '../recoil/atoms'
import fetchFromSpotify from '../services/api.js'
import { loadArtists, parseArtists } from '../services/SpotifyQuery.js'
import { async } from 'regenerator-runtime'
import { initial } from 'lodash'
import ResultPopup from '../components/ResultPopup.jsx'
import { NavLink } from 'react-router-dom'

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
  const [qtySongs, setQtySongs] = useRecoilState(qtySongsAtom)

  const [popup, setPopup] = useRecoilState(popupAtom)
  const [gameOver, setGameOver] = useRecoilState(gameOverAtom);
  const [maxLives, setMaxLives] = useRecoilState(maxLivesAtom);

  // useEffect(() => {
  //   if (timeRemaining <= 0) {
  //     setGameOver(!gameOver)
  //   }
  //   if (livesRemaining < 1) {
  //     setGameOver(!gameOver)
  //   }
  // }, [setGameOver])

  // useEffect(() => {
  //   if (gameOver) {
  //     setPopup(!popup)
  //   }
  // }, [setPopup]);

  useEffect(() => {
    const artists = JSON.parse(localStorage.getItem('artists'))
    if (artists) {
      setArtists(artists.items.name)
    }
  })

  // const getArtists = async () => {
  //   const artistRequest = await fetchFromSpotify({
  //     token,
  //     endpoint: `artists/${songToGuess.chosenArtists[0].id}`
  //   });

  //   const artistResponse = await fetchFromSpotify({
  //     token,
  //     endpoint: `artists/${songToGuess.chosenArtists[0].id}/related-artists`,
  //   });
  //   setChosenArtists(
  //     randomizer(artistResponse.chosenArtists, config.retrievedArtists - 1).map((a) => ({ correct: false, a })).concat([{ correct: true, artistRequest }]).sort(() => Math.random() - 0.5)
  //   )
  // }


  function playSong(url) {
    const sound = new Howl({
      src: [url],
      preload: true,
      html5: true,
    })
    sound.play()
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

      if (Ref.current) {
        clearInterval(Ref.current);
      }
      const id = setInterval(() => { this.start(timeOut) }, 1000)
      Ref.current = id;
    }
  }

  const handlePlaySong = () => {
    timer.reset()
    console.log(songToGuess)
    playSong(songToGuess.url)
  }
  //---------Game Logic---------\\
  //Start new rounds when roundNumber is changed
  const startNewRound = () => {
    const songToGuessIntermediate = getRandomSong(songsToChooseFrom)
    setRoundNumber(parseInt(roundNumber) + 1)
    setSongToGuess(songToGuessIntermediate)
    setArtistChoices(selectNArtists(qtyArtistsChosen, chosenArtists, songToGuessIntermediate))
  }

  // const [popup, setPopup] = useRecoilState(popupAtom)
  // const [gameOver, setGameOver] = useRecoilState(gameOverAtom);

  //monitor game state
  useEffect(() => {
    if (livesRemaining < 1 || timeRemaining < 1) {
      console.log("Lose condition reached")
      setPopup("You Lose!!!")
      setGameOver(true)
    }
    else if (roundNumber > qtySongs) {
      setPopup("You Win!!!")
      setGameOver(true)
    }

  }, [timeRemaining, livesRemaining, roundNumber]);

  //check user answer
  const handleUserGuess = (userGuess) => {
    if (userGuess === songToGuess.artist) {
      console.log("Correct guess!!!")
      startNewRound();
    }
    else {
      setLivesRemaining(parseInt(livesRemaining) - 1)
    }
  }
  useEffect(() => { const volumeSlider = document.getElementById('volume');
  console.log(volumeSlider)
  volumeSlider.addEventListener('input', function() {
    const volume = parseFloat(this.value) / 12.0;
    Howler.volume(volume);
  }); }, []);


  const resetGame = () => {
    const songToGuessIntermediate = getRandomSong(songsToChooseFrom)
    setRoundNumber(1);
    setLivesRemaining(maxLives);
    setSongToGuess(songToGuessIntermediate)
    setArtistChoices(selectNArtists(qtyArtistsChosen, chosenArtists, songToGuessIntermediate));
    setTimeRemaining(timeLimit);
    setGameOver(false);
    setPopup('');
  }

  //---------JSX---------\\
  return (
    <div>
      <Container>
        <Header>Round {roundNumber}</Header>
        <Card>
          <GridContainer>
              {artistChoices
                .map((artist, index) => (
                  <GridItem key={index}>
                    <Button onClick={event => handleUserGuess(event.target.innerHTML)} style={{ margin: '10px' }} id={index}>{artist}</Button>
                  </GridItem>))}
            </GridContainer>
          <Button onClick = {handlePlaySong}>PLAY SONG</Button>
          <div>
  <input type="range" id="volume" name="volume" min="0" max="12"/>
  <label for="volume">Volume</label>
</div>
          <span style={{ display: 'flex', flexDirection: 'row' }}>
            <Button style={{ marginRight: '220px', cursor: 'default' }}>Lives Remaining: {livesRemaining}</Button>
            <Button style={{ cursor: 'default' }}>Time remaining: {timeRemaining}</Button>
          </span>
          {gameOver? 
            <ResultPopup>
              <h2>{popup}</h2> <br />
              <span style={{ display: "flex" }}>
                <NavLink to = "/"><Button style={{ marginRight: '50px' }}>Return to Menu</Button></NavLink>
                <Button onClick = {resetGame}>Try Again</Button>
              </span>
            </ResultPopup>
          : null}
          

        </Card>
      </Container>
    </div>
  )
}

export default Game