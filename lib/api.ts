import axios from 'axios';
import type { NewNote, Note } from '@/types/note';

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

const API_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const API_URL = 'https://notehub-public.goit.study/api/notes';

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<NotesHttpResponse> => {
  const { data } = await axios.get<NotesHttpResponse>(API_URL, {
    params: {
      search,
      page,
      perPage: 12,
      tag,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  console.log(data);
  return data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await axios.post<Note>(API_URL, newNote, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${API_URL}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`${API_URL}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};
