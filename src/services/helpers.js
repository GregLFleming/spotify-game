import Howl from 'howler'

export const checkUserGuess = (userGuess, correctAnswer) => {
  return (correctAnswer.artistName === userGuess)
}

export const getRandomSong = (listOfSongs) => {
  return (listOfSongs[getRandomInt(listOfSongs.length)])
}

export const getRandomInt = (maxValue) => {
  maxValue = parseInt(maxValue);
  return Math.floor(Math.random() * maxValue);
}

export const selectNArtists = (qtyArtistsChosen, artists, songToGuess) => {
  let n = parseInt(qtyArtistsChosen)

  //Put correct answer into the array of length n
  let nChoices = Array(n)
  const resultLocation = getRandomInt(n - 1)
  nChoices[resultLocation] = songToGuess.artist

  let i = 0
  let choiceToAdd
  //Populate all remaining indicies of array with random artists
  while (i < n) {
    if (i != resultLocation) {
      do{
        choiceToAdd = artists[getRandomInt(artists.length - 1)]
      }
      while(nChoices.includes(choiceToAdd))

      nChoices[i] = choiceToAdd
    }
    i += 1;
  }
  return nChoices
}

export const createCountdownTimer = (maxTime, setTimeRemaining) => {
  let timer = {
    timeRemaining: maxTime,
    timerId: null,
    isRunning: false,

    start: function () {this.isRunning ? null : this.timerId = setInterval(() => {
          this.timeRemaining -= 1
          setTimeRemaining(this.timeRemaining)
          this.isRunning = true
        }, 1000) },

    stop: function () {
      clearInterval(this.timerId)
      this.isRunning = false;
    },

    reset: function () {
      this.timeRemaining = maxTime
      setTimeRemaining(maxTime)
      this.isRunning = false;
    }
  }
  return timer;
}

export const disableElementsByClassName = (elementClassName) => {
  let buttons = document.getElementsByClassName(elementClassName)
      for(let button of buttons){
        button.disabled = true;
      }
    }

export const enableElementsByClassName = (elementClassName) => {
  let buttons = document.getElementsByClassName(elementClassName)
      for(let button of buttons){
        button.disabled = false;
      }
    }
