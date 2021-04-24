import { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';

export function Player() {
    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext);

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
                        alt={episode.title}
                        objectFit="cover"
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
                    <p> 00:00 </p>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
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
                        onPlay={ function () {
                            setPlayingState(true);
                        }}
                        onPause={ function () {
                            setPlayingState(false);
                        }}
                    />
                }

                <div className={styles.controls}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode}>
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

                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Reproduzir proximo" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repitir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}