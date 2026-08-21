import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { Metadata } from 'next';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? 'All notes' : slug[0];
  return {
    title: `Notes: ${tag}`,
    description: `Filtered by: ${tag}`,
    openGraph: {
      title: `Notes: ${tag}`,
      description: `Filtered by: ${tag}`,
      url: `https://08-zustand-three-virid.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: tag,
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();

  const searchNote = '';
  const currentPage = 1;

  await queryClient.prefetchQuery({
    queryKey: ['notes', searchNote, currentPage, tag],
    queryFn: () => fetchNotes(searchNote, currentPage, tag),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
