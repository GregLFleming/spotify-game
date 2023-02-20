import React from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { livesRemainingAtom, roundNumberAtom, secondsRemainingAtom } from '../recoil/atoms'



const Game = () => {
  //---------Recoil State Storage---------\\
  const [livesRemaining, setLivesRemaining] = useRecoilState(livesRemainingAtom)
  const [roundNumber, setRoundNumber] = useRecoilState(roundNumberAtom)
  const [secondsRemaining, setSecondsRemaining] = useRecoilState(secondsRemainingAtom)
  return (
    <div>
        <Container>
            <Header>Round {roundNumber}</Header>
            <Card>
              <span style={{display: 'flex', flexDirection: 'row'}}>
                <Button style={{marginRight: '75px'}}>Artist 1</Button>
                <Button>Artist 2</Button>
              </span>
              <span style={{display: 'flex', flexDirection: 'row'}}>
                <Button style={{marginRight: '75px'}}>Artist 3</Button>
                <Button>Artist 4</Button>
              </span>
                <Button>PLAY SONG</Button>
              <span  style={{display: 'flex', flexDirection: 'row'}}>
                <Button style={{marginRight: '220px'}}>{livesRemaining}</Button>
                <Button>Time remaining: {secondsRemaining}</Button>
              </span>
            </Card>
        </Container>
    </div>
  )
}

export default Game