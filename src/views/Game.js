import React from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'
import styled from "styled-components"
import { useRecoilState } from 'recoil' //needed to manage state with recoil
import { qtyArtistsChosenAtom, songToGuessAtom, livesRemainingAtom, roundNumberAtom, secondsRemainingAtom } from '../recoil/atoms'

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
  const [secondsRemaining, setSecondsRemaining] = useRecoilState(secondsRemainingAtom)
  const [qtyArtistsChosen, setQtyArtistsChosen] = useRecoilState(qtyArtistsChosenAtom)
  const [songToGuess, setSongToGuess] = useRecoilState(songToGuessAtom)

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