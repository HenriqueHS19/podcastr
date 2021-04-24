import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './styles.module.scss';

interface IEpisode {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    description: string;
    url: string;
}

interface IEpisodeProps {
    episode: IEpisode;
}

export default function Episode({ episode }: IEpisodeProps) {
    return (
        <section className={styles.container}>
            <div>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                />

                <button type="button" className={styles.reproduceButton}>
                    <img src="/play.svg" alt="Reproduzir episodio" />
                </button>
            </div>

            <h1> {episode.title} </h1>

            <div className={styles.details}>
                <span> {episode.members} </span>
                <span className={styles.separator}></span>
                <span> {episode.publishedAt} </span>
                <span className={styles.separator}></span>
                <span> {episode.durationAsString} </span>
            </div>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />

        </section>
    );
}

export const getStaticPaths: GetStaticPaths = async function () {
    return {
        paths: [],
        fallback: 'blocking',
    };
}

export const getStaticProps: GetStaticProps = async function (context) {
    const { slug } = context.params;

    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        thumbnail: data.thumbnail,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24 // 24 hours
    };
}