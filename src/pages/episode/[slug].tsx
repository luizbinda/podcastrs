import {GetStaticPaths, GetStaticProps} from "next";
import {api} from "../../services/api";
import Link from 'next/link'
import {format, parseISO} from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import convertDurationToTimeString from "../../utils/convertDurationToTimeString";
import styles from './episode.module.scss';
import Image from 'next/image';

type File =  {
    url: string,
    type: string,
    duration: string
}

type Espisodes = {
    id: string,
    title: string,
    members: string,
    published_at: string,
    thumbnail: string,
    description: string,
    file: File
}

type EpisodeProps = {
    episode: Espisodes
}

export default function Episode({episode}: EpisodeProps) {
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer} >
                <Link href="/" >
                <button type="button">
                    <img src="/arrow-left.svg" alt="Voltar"/>
                </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button">
                    <img src="/play.svg" alt="Tocar Episodeo"/>
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.published_at}</span>
                <span>{episode.file.duration}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description}}/>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async() => {
    return {
        paths: [],
        fallback: 'blocking'
    }
};

export const getStaticProps : GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const {data} = await api.get(`/episodes/${slug}`);

    const episode = {
        ...data,
        published_at: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBr}),
        file: {
            ...data.file,
            duration: convertDurationToTimeString(Number(data.file.duration))
        }
    }


    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, //24hrs
    }
}
