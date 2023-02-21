import React, {useRef, useEffect} from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import styled from "styled-components"
import { useRecoilState } from 'recoil'
import { timeLimitAtom, qtyArtistsChosenAtom, songToGuessAtom, livesRemainingAtom, roundNumberAtom, timeRemainingAtom } from '../recoil/atoms'

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

const Game = () => {
  //---------Recoil State Storage---------\\
  const [livesRemaining, setLivesRemaining] = useRecoilState(livesRemainingAtom)
  const [roundNumber, setRoundNumber] = useRecoilState(roundNumberAtom)
  const [timeRemaining, setTimeRemaining] = useRecoilState(timeRemainingAtom)
  const [timeLimit, setTimeLimit] = useRecoilState(timeLimitAtom)
  const [qtyArtistsChosen, setQtyArtistsChosen] = useRecoilState(qtyArtistsChosenAtom)
  const [songToGuess, setSongToGuess] = useRecoilState(songToGuessAtom)

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
          <Button onClick = {onClickReset}>PLAY SONG</Button>
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