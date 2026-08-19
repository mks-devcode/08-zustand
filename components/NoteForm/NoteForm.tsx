'use client';

import css from '@/components/NoteForm/NoteForm.module.css';
import { Form, Formik, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { createNote } from '@/lib/api';

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const INITIAL_VALUES: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .min(3, 'At least 3 characters.')
    .max(50, 'Not more than 50 characters.')
    .required('Title is required'),
  content: Yup.string().max(500, 'Not more than 500 characters.'),
  tag: Yup.mixed()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
      message.success('Post created successfully!');
    },
    onError: () => {
      message.error('Something went wrong!');
    },
  });

  const handleSubmit = (values: NoteFormValues, formikHelpers: FormikHelpers<NoteFormValues>) => {
    mutate(values);
    console.log(values);
    formikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
