import Howl from 'howler'
import { useRef, useEffect } from 'react'
import { timeRemainingAtom, timeLimitAtom } from '../recoil/atoms'
import { useRecoilState } from 'recoil'

export function playSong(url) {
  const sound = new Howl({
    src: [url],
    preload: true,
    html5: true,
  })
  sound.play()
}
export const checkUserGuess = (userGuess, correctAnswer) => {
  return (correctAnswer.artistName === userGuess)
}

export const getRandomSong = (listOfSongs) => {
  return listOfSongs[getRandomInt(listOfSongs.length)]
}

export const getRandomInt = (maxValue) => {
  maxValue = parseInt(maxValue);
  return Math.floor(Math.random() * max);
}