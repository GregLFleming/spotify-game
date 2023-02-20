import { atom } from 'recoil';

//---------Spotify Fetch Storage---------\\
export const songsToChooseFromAtom = atom({
    key: 'songsToChooseFrom',
    default: []
});

export const artistsToChooseFromAtom = atom({
    key: 'artistsToChooseFrom',
    default: []
});

export const genresToChooseFromAtom = atom({
    key: 'genresToChooseFrom',
    default: []
});

export const tokenAtom = atom({
    key: 'token',
    default: ''
})

//---------Asynchronous Load Status---------\\
export const tokenAuthorizationLoadingAtom = atom({
    key: 'tokenAuthorizationLoading',
    default: false
})

export const configLoadingAtom = atom({
    key: 'configLoading',
    default: false
})


//---------User Input Storage---------\\
export const genreSelectedAtom = atom({
    key: 'genre',
    default: ''
});

export const qtyArtistChoicesAtom = atom({
    key: 'qtyArtistChoices',
    default: 2
});

export const qtySongsAtom = atom({
    key: 'qtySongs',
    default: 1
});

//---------App Generated Storage---------\\
export const roundNumberAtom = atom({
    key: 'roundNumber',
    default: 1
});

export const livesRemainingAtom = atom({
    key: 'livesRemaining',
    default: 1
});

export const secondsRemainingAtom = atom({
    key: 'secondsRemaining',
    default: 30
});