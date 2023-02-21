export const checkUserGuess = (userGuess, correctAnswer) => {
    return(correctAnswer.artistName === userGuess)
}

export const getRandomSong = (listOfSongs) => {
    return listOfSongs[getRandomInt(listOfSongs.length)]
}

export const getRandomInt = (maxValue) => {
    maxValue = parseInt(maxValue);
    return Math.floor(Math.random() * max);
}