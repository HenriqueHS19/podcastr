import styles from './styles.module.scss';

export function Player() {
    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Poscastr" />
                <strong> Tocando agora </strong>
            </header>

            <div className={styles.message}>
                <p> Selecione um <br /> podcast para ouvir </p>
            </div>

            <div className={styles.podcastInfo}>
                <div className={styles.img}></div>
                <h2> Como codar tranquilo </h2>
                <p> Tiago e Maria </p>
            </div>

            <footer>
                <div className={styles.duration}>
                    <p> 00:00 </p>
                    <span></span>
                    <p> 00:00 </p>
                </div>

                <div className={styles.controls}>
                    <button>
                        <img src="/shuffle.svg" alt="Shuffle icon" />
                    </button>

                    <button>
                        <img src="/play-previous.svg" alt="Previous icon" />
                    </button>

                    <button className={styles.playButton}>
                        <img src="/play.svg" alt="Play icon" />
                    </button>

                    <button>
                        <img src="/play-next.svg" alt="Next icon" />
                    </button>

                    <button>
                        <img src="/repeat.svg" alt="repeat icon" />
                    </button>
                </div>
            </footer>
        </div>
    );
}