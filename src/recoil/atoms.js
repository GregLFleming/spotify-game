import { atom } from 'recoil';

//---------Spotify Fetch Storage---------\\
export const songsToChooseFrom = atom({
    key: 'songsToChooseFrom',
    default: []
});

export const artistsToChooseFrom = atom({
    key: 'artistsToChooseFrom',
    default: []
});


//---------User Input Storage---------\\
export const genreSelected = atom({
    key: 'genre',
    default: ''
});

export const qtyArtistChoices = atom({
    key: 'qtyArtistChoices',
    default: 2
});

export const qtySongs = atom({
    key: 'qtySongs',
    default: 1
});

//---------App Generated Storage---------\\
export const roundNumber = atom({
    key: 'roundNumber',
    default: 1
});

export const livesRemaining = atom({
    key: 'livesRemaining',
    default: 1
});

export const secondsRemaining = atom({
    key: 'secondsRemaining',
    default: 30
});