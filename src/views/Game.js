
import React, { useRef, useEffect,useState} from 'react'

import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import styled from "styled-components"
import { createCountdownTimer, displayNumArtists, playSong, selectNArtists, getRandomSong } from '../services/helpers';
import Spin from 'react-reveal/Spin';
import Flash from 'react-reveal/Flash';
import Jump from 'react-reveal/Jump';
import Shake from 'react-reveal/Shake';
import Tada from 'react-reveal/Tada';
import { useRecoilState, useRecoilValue } from 'recoil' //needed to manage state with recoil
import { maxLivesAtom, gameOverAtom, popupAtom, qtySongsAtom, gameStatusAtom, artistChoicesAtom, songsToChooseFromAtom, qtyArtistsChosenAtom, songToGuessAtom, livesRemainingAtom, roundNumberAtom, secondsRemainingAtom, artistsToChooseFromAtom, timeLimitAtom, timeRemainingAtom } from '../recoil/atoms'
import fetchFromSpotify from '../services/api.js'
import { loadArtists, parseArtists } from '../services/SpotifyQuery.js'
import { async } from 'regenerator-runtime'
import { initial } from 'lodash'
import ResultPopup from '../components/ResultPopup.jsx'
import { NavLink } from 'react-router-dom'
import guitarist from '../assets/guitarist.jpg';
import cassette from '../assets/cassette.jpg';
import gameStyles from '../styles/gameStyles.css';


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

const randomizer = (arr, count) => arr.sort(() => Math.random() - 0.5).slice(0, count);


const Game = () => {
  //---------Recoil State Storage---------\\
  //Game Mechanics
  const [livesRemaining, setLivesRemaining] = useRecoilState(livesRemainingAtom)
  const [roundNumber, setRoundNumber] = useRecoilState(roundNumberAtom)
  const [timeRemaining, setTimeRemaining] = useRecoilState(timeRemainingAtom)
  const [songToGuess, setSongToGuess] = useRecoilState(songToGuessAtom)

  //Internal State
  const songsToChooseFrom = useRecoilValue(songsToChooseFromAtom)
  const artistsToChooseFrom = useRecoilValue(artistsToChooseFromAtom) //list of all artists in genre
  const [artistChoices, setArtistChoices] = useRecoilState(artistChoicesAtom) //options presented to user
  const [popup, setPopup] = useRecoilState(popupAtom)
  const [gameOver, setGameOver] = useRecoilState(gameOverAtom);
  const [sound, setSound] = useState(null);
  
  //Settings Selected By User
  const timeLimit = useRecoilValue(timeLimitAtom)
  const qtyArtistsChosen = useRecoilValue(qtyArtistsChosenAtom)
  const qtySongs = useRecoilValue(qtySongsAtom)
  const maxLives = useRecoilValue(maxLivesAtom);

  
  
  //Controls for howler
  useEffect(() => {
    const volumeSlider = document.getElementById('volume');
    console.log(volumeSlider)
    volumeSlider.addEventListener('input', function () {
      const volume = parseFloat(this.value) / 12.0;
      Howler.volume(volume);
    });
  }, []);

  function playSong(url) {
    setSound(new Howl({
      src: [url],
      preload: true,
      html5: true,
    }));
  }

  function handlePauseSong() {
    if (sound) {
      sound.pause();
    }
  }

  useEffect(() => {
    if (sound) {
      sound.play();
      return () => {
        sound.stop();
      };
    }
  }, [sound]);

  const handlePlaySong = () => {
    timer.current.start()
    document.getElementById("gameButton").disabled = true;
    playSong(songToGuess.url)
  }

  //---------Game Logic---------\\
  //create a new timer only if one does nto alredy exist
  const timer = timer ? timer : useRef(createCountdownTimer(timeLimit, setTimeRemaining));

  //reset game state
  const resetGame = () => {
    //enable all buttons
    document.getElementById("gameButton").disabled = false;
    let buttons = document.getElementsByClassName('artistChoice')
      for(let button of buttons){
        button.disabled = false;
      }

    const songToGuessIntermediate = getRandomSong(songsToChooseFrom)
    setRoundNumber(1);
    setLivesRemaining(maxLives);
    setSongToGuess(songToGuessIntermediate)
    setArtistChoices(selectNArtists(qtyArtistsChosen, artistsToChooseFrom, songToGuessIntermediate));
    setGameOver(false);
    setPopup('');
    timer.current.stop();
    timer.current.reset();
  }

  //Start new rounds when roundNumber is changed
  const startNewRound = () => {
    //reset all buttons
    document.getElementById("gameButton").disabled = false;
    let buttons = document.getElementsByClassName('artistChoice')
      for(let button of buttons){
        button.disabled = false;
      }
    
    timer.current.stop()
    timer.current.reset()

    const songToGuessIntermediate = getRandomSong(songsToChooseFrom)
    setRoundNumber(parseInt(roundNumber) + 1)
    setSongToGuess(songToGuessIntermediate)
    setArtistChoices(selectNArtists(qtyArtistsChosen, artistsToChooseFrom, songToGuessIntermediate))
  }

  //Check for end game conditions
  useEffect(() => {
    if (livesRemaining < 1 || timeRemaining < 1) {
      timer.current.stop()
      timer.current.reset()
      sound.stop()
      setPopup("Oops, you dropped that one.")
      setGameOver(true)
    }
    else if (roundNumber > qtySongs) {
      timer.current.stop()
      timer.current.reset()
      setRoundNumber(qtySongs)
      setPopup("Rock on, You won!!!")
      setGameOver(true)
    }

  }, [timeRemaining, livesRemaining, roundNumber]);

  //Check user's answer
  const handleUserGuess = (userGuess) => {
    console.log(userGuess)
    userGuess.disabled = true;
    if (userGuess.innerHTML === songToGuess.artist) {
      handlePauseSong();
      startNewRound();
    }
    else {
      setLivesRemaining(parseInt(livesRemaining) - 1)
    }
  }

  //---------JSX---------\\
  return (
    <div>
      <Container>
        <img src={guitarist} alt='Picture of guitarist'/>
        <Header><Spin>{`Round ${roundNumber}`}</Spin></Header>
        <Card>
          <Flash>
          <GridContainer>
              {artistChoices
                .map((artist, index) => (
                  <GridItem key={index}>
                    <Button className = "artistChoice" disabled = {false} onClick={event => handleUserGuess(event.target)} style={{ margin: '10px', backgroundColor: '#08B2E3' }} id={index} >{artist}</Button>
                  </GridItem>))}
            </GridContainer>
            </Flash>
            <Jump>
          <Button id='gameButton' onClick = {handlePlaySong}>BEGIN ROUND</Button>
          </Jump>
          <div>
            <input type="range" id="volume" name="volume" min="0" max="12" />
            <label>Volume</label>
          </div>
          <span style={{ display: 'flex', flexDirection: 'row' }}>
            <Button id='gameButton'  style={{ marginRight: '220px', cursor: 'default' }}>Lives Remaining: {livesRemaining}</Button>
            <Button id='gameButton'  style={{ cursor: 'default' }}>Time remaining: {timeRemaining}</Button>
          </span>
          {gameOver? 
            <ResultPopup className='ResultPopup' style={{backgroundImage: `url(${cassette})`
          }}>
              <h2><Shake>{popup}</Shake></h2> <br />
              <span style={{ display: "flex" }}>
                <NavLink style={{textDecoration: 'none'}} to = "/"><Tada><Button id='popupButton'  style={{ marginRight: '50px', textDecoration: 'none' }}>Return to Menu</Button></Tada></NavLink>
                <Tada>
                <Button id='popupButton' onClick = {resetGame}>Try Again</Button>
                </Tada>
              </span>
            </ResultPopup>
            : null}
        </Card>
      </Container>
    </div>
  )
}

export default Game