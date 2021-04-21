import {GetStaticProps}from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {api} from "../services/api";
import {format, parseISO} from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import convertDurationToTimeString from "../utils/convertDurationToTimeString";
import styles from './home.module.scss'
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

type HomeProps = {
    latestEpisodes: Array<Espisodes>
    allEpisodes: Array<Espisodes>
}

export default function Home({latestEpisodes, allEpisodes }: HomeProps) {
  return (
      <div className={styles.homepage}>
          <section className={styles.latestEpisodes}>
              <h2>Últimos lançamentos</h2>
              <ul>
                  {latestEpisodes.map(episode => (
                      <li key={episode.id}>
                          <div style={{ width: 100}}>
                              <Image
                                  width={192}
                                  height={192}
                                  src={episode.thumbnail}
                                  alt={episode.title}
                                  objectFit="cover"
                              />
                          </div>
                          <div className={styles.episodeDetails}>
                              <Link href={`/episode/${episode.id}`}>
                                  <a >{episode.title}</a>
                              </Link>
                              <p>{episode.members}</p>
                              <span>{episode.published_at}</span>
                              <span>{episode.file.duration}</span>
                          </div>
                          <button type="button">
                              <img src="/play-green.svg" alt="Tocar Episodeo"/>
                          </button>
                      </li>
                  ))}
              </ul>

          </section>
          <section className={styles.allEpisodes}>
              <h2>Todos episódios</h2>
              <table cellSpacing={0}>
                  <thead>
                  <tr>
                      <th></th>
                      <th>Podcast</th>
                      <th>Integrantes</th>
                      <th>Data</th>
                      <th>Duração</th>
                      <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                      allEpisodes.map( episode => (
                          <tr key={episode.id}>
                              <td style={{ width: 72}}>
                                  <Image
                                      src={episode.thumbnail}
                                      width={120}
                                      height={120}
                                      alt={episode.title}
                                      objectFit="cover"
                                  />
                              </td>
                              <td>
                                  <Link href={`/episode/${episode.id}`}>
                                      <a >{episode.title}</a>
                                  </Link>
                              </td>
                              <td>{episode.members}</td>
                              <td style={{ width: 100}}>{episode.published_at}</td>
                              <td>{episode.file.duration}</td>
                              <td>
                                  <button type="button">
                                      <img src="/play-green.svg" alt="Tocar episódio" />
                                  </button>
                              </td>
                          </tr>
                      ))
                  }
                  </tbody>

              </table>
          </section>
      </div>
  )
}

export const getStaticProps : GetStaticProps = async () => {
  const {data} = await api.get('episodes',
      {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
      });


  const episodes = data.map( (episode : Espisodes) => {
    return {
        ...episode,
        published_at: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBr}),
        file: {
            ...episode.file,
            duration: convertDurationToTimeString(Number(episode.file.duration))
        }
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
        latestEpisodes,
        allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
