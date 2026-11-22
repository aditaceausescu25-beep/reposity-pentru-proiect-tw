import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <section className={`panel ${styles.box}`} data-testid="not-found">
      <span className={styles.code}>404</span>
      <h2>Pagina nu există</h2>
      <p className="info">
        Adresa cerută nu duce nicăieri sau anunțul a fost mutat.
      </p>
      <Link to="/" className={`btn ${styles.btnLink}`}>
        ← Înapoi la produse
      </Link>
    </section>
  );
}