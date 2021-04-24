import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './styles.module.scss';

interface IEpisodes {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    url: string;
}

interface IHome {
    latestEpisodes: Array<IEpisodes>;
    allEpisodes: Array<IEpisodes>;
}

export default function Home({ latestEpisodes, allEpisodes }: IHome) {
    return (
        <div className={styles.homepage}>
            <section className={styles.latestEpisodes}>
                <h2> Últimos Lançamentos </h2>

                <ul>
                    {latestEpisodes.map(function (episode) {
                        return (
                            <li key={episode.id}>
                                <Image
                                    width={192}
                                    height={192}
                                    src={episode.thumbnail}
                                    alt={episode.title}
                                    objectFit="cover"
                                />

                                <div className={styles.details}>
                                    <Link href={`/episodes/${episode.id}`}>
                                        <a> {episode.title} </a>
                                    </Link>
                                    <p> {episode.members} </p>

                                    <div>
                                        <span> {episode.publishedAt} </span>
                                        <span className={styles.separator}></span>
                                        <span> {episode.durationAsString} </span>
                                    </div>
                                </div>

                                <button>
                                    <img src="/play-green.svg" alt="Tocar episódio" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section className={styles.allEpisodes}>
                <h2> Todos os episódios </h2>

                <table cellSpacing={0}>
                    <thead>
                        <tr>
                            <th></th>
                            <th> Podcast </th>
                            <th> Integrantes </th>
                            <th> Data </th>
                            <th> Duração </th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {allEpisodes.map(function (episode) {
                            return (
                                <tr key={episode.id}>
                                    <td style={{ width: 72 }}>
                                        <Image
                                            width={120}
                                            height={120}
                                            src={episode.thumbnail}
                                            alt={episode.title}
                                            objectFit="cover"
                                        />
                                    </td>

                                    <td>
                                        <Link href={`/episodes/${episode.id}`}>
                                            <a> {episode.title} </a>
                                        </Link>
                                    </td>

                                    <td>
                                        <span> {episode.members} </span>
                                    </td>

                                    <td style={{ width: 100 }}>
                                        <span> {episode.publishedAt} </span>
                                    </td>

                                    <td>
                                        <span> {episode.durationAsString} </span>
                                    </td>

                                    <td>
                                        <button>
                                            <img src="/play-green.svg" alt="Reproduzir episodio" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </section>

        </div>
    )
};

export const getStaticProps: GetStaticProps = async function () {
    const { data } = await api.get('/episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc',
        }
    });

    const episodes = data.map(function (episode) {
        return {
            id: episode.id,
            title: episode.title,
            members: episode.members,
            thumbnail: episode.thumbnail,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
            duration: Number(episode.file.duration),
            durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
            description: episode.description,
            url: episode.file.url,
        }
    });

    const latestEpisodes = episodes.slice(0, 2);
    const allEpisodes = episodes.slice(2, episodes.length);

    return {
        props: {
            latestEpisodes,
            allEpisodes,
        },
        revalidate: 60 * 60 * 8,
    }
};