'use client';

import css from '@/components/NoteForm/NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { createNote } from '@/lib/api';
import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { useDraftStore } from '@/lib/store/noteStore';

export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useDraftStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      message.success('Post created successfully!');
      clearDraft();
      router.push('/notes/filter/all');
    },
    onError: () => {
      message.error('Something went wrong!');
    },
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
    mutate({ title, content, tag });
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleChange}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleChange}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          disabled={isPending}
          onClick={() => router.push('/notes/filter/all')}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
