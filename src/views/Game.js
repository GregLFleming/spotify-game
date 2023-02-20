import React from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Header from '../components/Header.jsx'

const Game = () => {
  return (
    <div>
        <Container>
            <Header>Round 1</Header>
            <Card>
              <span style={{display: 'flex', flexDirection: 'row'}}>
                <Button style={{marginRight: '75px'}}>Artist 1</Button>
                <Button>Artist 2</Button>
              </span>
              <span style={{display: 'flex', flexDirection: 'row'}}>
                <Button style={{marginRight: '75px'}}>Artist 3</Button>
                <Button>Artist 4</Button>
              </span>
                <Button>START</Button>
              <span  style={{display: 'flex', flexDirection: 'row'}}>
                <Button style={{marginRight: '220px'}}>Lives Remaining</Button>
                <Button>Time Remaining</Button>
              </span>
            </Card>
        </Container>
    </div>
  )
}

export default Game