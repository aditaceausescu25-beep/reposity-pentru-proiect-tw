import { Link } from "react-router-dom";
import styles from "./DesprePage.module.css";

export default function DesprePage() {
  return (
    <section className={styles.page}>
      <div className={`panel ${styles.hero}`}>
        <span className={styles.tag}>Economie circulară</span>
        <h1>Despre Târg Local</h1>
        <p className={styles.lead}>
          Târg Local este o platformă de comunitate construită pas cu pas în cadrul
          proiectului de Tehnologii Web, unde lucrurile bune primesc o a doua viață
          prin donații, schimburi și vânzări locale fără comisioane.
        </p>
        <Link to="/" className={`btn ${styles.cta}`}>
          Explorează anunțurile →
        </Link>
      </div>

      <div className={styles.cards}>
        <article className={`panel ${styles.card}`}>
          <span className={styles.icon}>🌱</span>
          <h2>Mai puțină risipă</h2>
          <p>
            Fiecare obiect donat sau schimbat între vecini înseamnă resurse
            economisite și o comunitate mai conectată.
          </p>
        </article>

        <article className={`panel ${styles.card}`}>
          <span className={styles.icon}>🤝</span>
          <h2>Simplu și direct</h2>
          <p>
            Publici anunțuri rapid, negociezi prin oferte, salvezi favoritele și
            comanzi direct din coș fără pași inutili.
          </p>
        </article>

        <article className={`panel ${styles.card}`}>
          <span className={styles.icon}>⚙️</span>
          <h2>Tehnologii folosite</h2>
          <p>
            React, Vite, React Router, CSS Modules, JSON Server, urmând să fie
            extins cu Node.js, Express, MariaDB și Docker.
          </p>
        </article>
      </div>
    </section>
  );
}