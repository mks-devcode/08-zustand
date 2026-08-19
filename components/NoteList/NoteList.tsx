'use client';

import css from '@/components/NoteList/NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { deleteNote } from '@/lib/api';
import { Note } from '@/types/note';
import Link from 'next/link';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      message.success('Post deleted!');
    },
    onError: () => {
      message.error('Something went wrong!');
    },
  });

  const handleDelete = (noteId: string) => {
    mutate(noteId);
  };
  return (
    <ul className={css.list}>
      {notes?.map(note => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>
            <button
              className={css.button}
              disabled={isPending}
              onClick={() => {
                handleDelete(note.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
