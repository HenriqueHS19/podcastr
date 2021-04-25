import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { IoShuffle, IoRepeat } from 'react-icons/io5';

import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffing,
        togglePlay,
        toggleLoop,
        toggleShuffing,
        setPlayingState,
        nextEpisode,
        previousEpisode,
        hasNext,
        hasPrevious,
        clearStatePlayer,
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(function () {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        }
        else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', function () {
            setProgress(audioRef.current.currentTime);
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            nextEpisode();
        }
        else {
            clearStatePlayer();
        }
    }

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Poscastr" />
                <strong> Tocando agora </strong>
            </header>

            { episode ? (
                <div className={styles.podcastInfo}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                        alt={episode.title}
                    />
                    <h2> {episode.title} </h2>
                    <p> {episode.members} </p>
                </div>
            )
                :
                (
                    <div className={styles.message}>
                        <p> Selecione um <br /> podcast para ouvir </p>
                    </div>
                )
            }

            <footer>
                <div className={styles.duration}>
                    <p> {convertDurationToTimeString(progress)} </p>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle = {{ backgroundColor: '#04d361' }}
                                railStyle = {{ backgroundColor: '#9f75ff' }}
                                handleStyle = {{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        )
                        :
                        (
                            <div className={styles.emptySlider}></div>
                        )
                    }

                    </div>
                    <p> {episode ? episode.durationAsString : '00:00'} </p>
                </div>

                {episode &&
                    <audio
                        ref={audioRef}
                        src={episode.url}
                        autoPlay
                        loop={isLooping}
                        onPlay={ function () {
                            setPlayingState(true);
                        }}
                        onPause={ function () {
                            setPlayingState(false);
                        }}
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpisodeEnded}
                    />
                }

                <div className={styles.controls}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        className={isShuffing ? styles.isActive : ''}
                        onClick={ function () {
                            toggleShuffing();
                        }}
                    >
                        <IoShuffle />
                    </button>

                    <button
                        type="button"
                        disabled={!episode || !hasPrevious}
                        onClick={ function () {
                            previousEpisode();
                        }}
                    >
                        <img src="/play-previous.svg" alt="Reproduzir anterior" />
                    </button>

                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick = {function () {
                            togglePlay();
                        }}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="Pausar"/>
                            : <img src="/play.svg" alt="Reproduzir" />
                        }

                    </button>

                    <button
                        type="button"
                        disabled={!episode || !hasNext}
                        onClick={ function () {
                            nextEpisode();
                        }}
                    >
                        <img src="/play-next.svg" alt="Reproduzir proximo" />
                    </button>

                    <button
                        type="button"
                        disabled={!episode}
                        className={isLooping ? styles.isActive : ''}
                        onClick={ function () {
                            toggleLoop();
                        }}
                    >
                        <IoRepeat />
                    </button>
                </div>
            </footer>
        </div>
    );
}