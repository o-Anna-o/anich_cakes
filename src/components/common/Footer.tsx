export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contacts">
        <a
          className="footer__contact footer__contact--telegram"
          href="https://t.me/Anna_Vegana"
          target="_blank"
          rel="noreferrer"
          aria-label="Перейти в Telegram-чат с @Anna_Vegana"
        >
          <svg className="footer__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.94 3.5 2.86 10.5c-1.03.39-1.01 1.08-.2 1.35l4.86 1.52 1.88 5.77c.24.66.03 1.02.75 1.02.5 0 .72-.23 1-.51l2.36-2.28 4.9 3.62c.9.5 1.55.24 1.78-.84l3.23-15.2c.33-1.32-.5-1.92-1.02-1.45z"
            />
          </svg>
          <span>@Anna_Vegana</span>
        </a>
        <a className="footer__contact" href="mailto:anich-cakes@yandex.ru">
          <svg className="footer__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7.5 12 13l8-5.5M5.5 19h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 18.5 7h-13A1.5 1.5 0 0 0 4 8.5v9A1.5 1.5 0 0 0 5.5 19Z"
            />
          </svg>
          <span>anich-cakes@yandex.ru</span>
        </a>
      </div>
    </footer>
  );
}
