import Howl from 'howler'
import { useRef, useEffect } from 'react'
import { timeRemainingAtom, timeLimitAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'


export const checkUserGuess = (userGuess, correctAnswer) => {
  return (correctAnswer.artistName === userGuess)
}

export const getRandomSong = (listOfSongs) => {
  return(listOfSongs[getRandomInt(listOfSongs.length)])
}

export const getRandomInt = (maxValue) => {
  maxValue = parseInt(maxValue);
  return Math.floor(Math.random() * maxValue);
}

export const selectNArtists = (qtyArtistsChosen, artists, songToGuess) => {
  let n = parseInt(qtyArtistsChosen)

  //put correct answer into the array of length n
  let nChoices = Array(n)
  const resultLocation = getRandomInt(n - 1)
  nChoices[resultLocation] = songToGuess.artist
  
  let i = 0
  //populate all remaining indecies of array with random artists
  while(i < n){
    if(i != resultLocation){
      nChoices[i] = artists[getRandomInt(artists.length - 1)]
    }
    i+= 1;
  }

  console.log("N ARTISTS IS USING THESE VALUES")
  console.log(qtyArtistsChosen)
  console.log(artists)
  console.log(songToGuess)
  console.log(nChoices)
  return nChoices
}
