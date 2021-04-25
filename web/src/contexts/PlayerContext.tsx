import { createContext, ReactNode, useContext, useState } from 'react';

interface IEpisode {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
}

interface IPlayerContext {
    episodeList: IEpisode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffing: boolean;
    play: (episode: IEpisode) => void;
    playList: (episodeList: IEpisode[], index: number) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffing: () => void;
    setPlayingState: (state: boolean) => void;
    nextEpisode: () => void;
    previousEpisode: () => void;
    clearStatePlayer: () => void;
    hasNext: boolean,
    hasPrevious: boolean;
}

interface IPlayerContextProvider {
    children: ReactNode;
}

export const PlayerContext = createContext({} as IPlayerContext);

export function PlayerContextProvider({ children }: IPlayerContextProvider) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffing, setIsShuffing] = useState(false);

    // play a single episode
    function play(episode: IEpisode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    // play all episodes
    function playList(episodeList: IEpisode[], index: number) {
        setEpisodeList(episodeList);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    // play and pause by button
    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffing() {
        setIsShuffing(!isShuffing);
    }

    // play and pause on the keyboard
    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    const hasNext = isShuffing || (currentEpisodeIndex + 1) < episodeList.length;
    const hasPrevious = currentEpisodeIndex > 0;

    function nextEpisode() {
        if (isShuffing) {
            const nextRandom = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandom);
        }
        else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function previousEpisode () {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    function clearStatePlayer() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                isLooping,
                isShuffing,
                play,
                playList,
                togglePlay,
                toggleLoop,
                toggleShuffing,
                setPlayingState,
                nextEpisode,
                previousEpisode,
                hasNext,
                hasPrevious,
                clearStatePlayer,
            }}
        >
            { children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}