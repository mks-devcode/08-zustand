import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
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
