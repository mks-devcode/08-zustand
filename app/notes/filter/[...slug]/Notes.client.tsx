'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';

import css from './NotesPage.module.css';
import { fetchNotes } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
// import { useParams } from 'next/navigation';

interface NotesClientProps {
  tag: string | undefined;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [searchNote, setSearchNote] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // const { slug } = useParams<{ slug: string[] }>();
  // const tag = slug[0] === 'all' ? undefined : slug[0];

  // const [prevTag, setPrevTag] = useState<string | undefined>(tag);

  // if (tag !== prevTag) {
  //   setPrevTag(tag);
  //   setCurrentPage(1);
  // }

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchNote(query);
    setCurrentPage(1);
  }, 1000);

  const { data, isSuccess, isPending, isError } = useQuery({
    queryKey: ['notes', searchNote, currentPage, tag],
    queryFn: () => fetchNotes(searchNote, currentPage, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isError) {
      message.error('Something went wrong!');
    }
  }, [isError]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      {isPending && !data && <Spin description="Loading" size="large"></Spin>}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}
