import {createContext, ReactNode, useContext, useState} from "react";
import {Episodes} from "../pages";


type PlayerContextData = {
    episodes: Episodes[],
    currentEpisodeIndex: number,
    play: (episode: Episodes) => void,
    isPlaying: Boolean,
    togglePay: () => void,
    setPlayingStatus: (state: Boolean) => void,
    playList: (list: Episodes[], index: number) => void,
    playNext: () => void,
    playPrevious: () => void,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLooping,
    isRandom,
    toggleRandom
}

type PlayerContextProviderPros = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export const usePlayer = () => {
    return useContext(PlayerContext);
}

export function PlayerContextProvider({children}: PlayerContextProviderPros) {
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isRandom, setIsRandom] = useState(false);

    const togglePay = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleLooping = () => {
        setIsLooping(!isLooping)
    }

    const toggleRandom = () => {
        setIsRandom(!isRandom)
    }



    const setPlayingStatus = (state: boolean) => {
        setIsPlaying(state)
    }

    const play = (episode: Episodes) => {
        setEpisodes([episode])
        setCurrentEpisodeIndex(0)
        togglePay()
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = (currentEpisodeIndex + 1) < episodes.length

    const playNext = () => {
        if (isRandom){
            const randomEpisodeIndex = Math.floor(Math.random() * episodes.length)
            setCurrentEpisodeIndex(randomEpisodeIndex)
        }
        else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    const playPrevious = () => {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    const playList = (list: Episodes[], index: number) => {
        setEpisodes(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    return (
        <PlayerContext.Provider
            value={{
                episodes,
                currentEpisodeIndex,
                play,
                isPlaying,
                togglePay,
                setPlayingStatus,
                playList,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                isLooping,
                toggleLooping,
                isRandom,
                toggleRandom
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}
