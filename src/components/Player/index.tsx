
import styles from './styles.module.scss'
import {useContext, useEffect, useRef, useState} from "react";
import {PlayerContext} from "../../contexts/PlayerContext";
import Image from "next/image";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import convertDurationToTimeString from "../../utils/convertDurationToTimeString";


export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgess] = useState(0);

    const setProgessListener = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.addEventListener('timeupdate', () => {
                setProgess(Math.floor(audioRef.current.currentTime))
            })
        }
    }

    const handleMoveSlider = (amount: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = amount
            setProgess(Math.floor(amount))
        }
    }

    const handleEndedAudio = () => {
        if (hasNext) {
            playNext()
        }
    }




    const {
        episodes,
        currentEpisodeIndex,
        isPlaying,
        togglePay,
        setPlayingStatus,
        playNext,
        playPrevious,
        hasPrevious,
        hasNext,
        isLooping,
        toggleLooping,
        toggleRandom,
        isRandom
    } = useContext(PlayerContext);

    const episode = episodes[currentEpisodeIndex];

    useEffect(() => {

        if (!audioRef.current) return;
        if (!isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
    } , [isPlaying, audioRef])

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="tocando agora" />
                <strong>tocando agora</strong>
            </header>
            {
                episode? (
                    <div className={styles.currentEpisode}>
                        <Image
                            src={episode.thumbnail}
                            width={592}
                            height={592}
                            alt={episode.title}
                            objectFit="cover"
                        />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                    )
            }
            <footer className={episode? '': styles.empty}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ?  (
                            <Slider
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ backgroundColor: '#04d361', borderWidth: 4}}
                                max={episode.file.duration}
                                value={progress}
                                onChange={handleMoveSlider}
                            />
                            ) : (
                                    <div className={styles.emptySlider}/>
                                )
                        }
                    </div>
                    <span>{episode && episode.file.durationFormated}</span>
                </div>
                {episode && (
                    <audio
                        src={episode.file.url}
                        autoPlay={true}
                        ref={audioRef}
                        loop={isLooping}
                        onPlay={() => setPlayingStatus(true)}
                        onPause={() => setPlayingStatus(false)}
                        onLoadedMetadata={setProgessListener}
                        onEnded={handleEndedAudio}
                    />
                )}
                <div className={styles.buttons}>
                    <button
                        onClick={toggleRandom}
                        disabled={!episode || episodes.length === 1}
                        type="button"
                        className={isRandom ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button onClick={playPrevious} disabled={!episode || !hasPrevious} type="button">
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button onClick={togglePay} disabled={!episode} type="button" className={styles.playButton}>
                        { isPlaying ?
                            (<img src="/pause.svg" alt="Pausar"/>) :
                            (<img src="/play.svg" alt="Tocar"/>)
                        }
                    </button>
                    <button onClick={playNext} disabled={!episode || !hasNext} type="button">
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button
                        onClick={toggleLooping}
                        disabled={!episode}
                        type="button"
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}
