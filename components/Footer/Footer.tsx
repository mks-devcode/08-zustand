import css from '@/components/Footer/Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Maks</p>
          <p>
            Contact us:{' '}
            <a href="https://github.com/mks-devcode" target="_blank">
              github.com/mks-devcode
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
