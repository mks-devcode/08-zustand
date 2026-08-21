import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create note',
  description: 'Creating a note: title, content, tag.',
  openGraph: {
    title: `Create note`,
    description: 'Creating a note: title, content, tag.',
    url: `http://localhost:3000`,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create note',
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
