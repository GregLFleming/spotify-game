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

// export const timer = {
//   // useEffect(() => {timer.clearTimer(timer.getDeadTime())}, []);

//   start: function(timeOut, setTimeRemaining){
//     const total = Date.parse(e) - Date.parse(new Date());
//     const seconds = Math.floor((total / 1000) % 60);
//     if (seconds >= 0) {
//       setTimeRemaining(seconds)
//     }
//   },

//   reset: function(timeLimit, setTimeRemaining, Ref){
//     let timeOut = new Date();
//     timeOut.setSeconds(timeOut.getSeconds() + timeLimit);
//     setTimeRemaining(timeLimit);
    
//     if (Ref.current) clearInterval(Ref.current);
//     const id = setInterval(() => {
//       this.start(timeOut, setTimeRemaining);
//     }, 1000)
//     Ref.current = id;
//   }