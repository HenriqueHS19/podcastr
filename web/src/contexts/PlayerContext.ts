import { createContext } from 'react';

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
    play: (episode: IEpisode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as IPlayerContext);