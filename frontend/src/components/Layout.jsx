import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import ComparaBar from "./ComparaBar.jsx";
import styles from "./Layout.module.css";

function temaInitiala() {
  try {
    const salvata = localStorage.getItem("marketplace_tema");
    if (salvata === "dark" || salvata === "light") return salvata;
  } catch {
    // ignoră eroarea de storage
  }
  return "light";
}

function navClass({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export default function Layout({
  numarProduseCos = 0,
  notificareCos,
  onInchideNotificare,
  compara = [],
  onScoateDinCompara,
  onGolesteCompara,
  onAdaugaInCos,
}) {
  const [tema, setTema] = useState(temaInitiala);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      localStorage.setItem("marketplace_tema", tema);
    } catch {
      // ignoră eroarea de storage
    }
  }, [tema]);

  function handleTema() {
    setTema((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoDot} />
            <span>Târg Local</span>
          </Link>

          <div className={styles.rightArea}>
            <nav className={styles.nav} data-testid="nav">
              <NavLink to="/" end className={navClass}>
                Explorează
              </NavLink>
              <NavLink to="/cont" className={navClass}>
                Cont
              </NavLink>
              <NavLink to="/despre" className={navClass}>
                Despre
              </NavLink>
              <NavLink
                to="/cos"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.cartLink} ${styles.cartLinkActive}`
                    : styles.cartLink
                }
              >
                <span>🛒 Coș</span>
                <span
                  key={notificareCos ? notificareCos.id : numarProduseCos}
                  className={
                    numarProduseCos > 0
                      ? `${styles.cartCount} ${styles.cartPop}`
                      : styles.cartCountEmpty
                  }
                >
                  {numarProduseCos}
                </span>
              </NavLink>
            </nav>

            {notificareCos && (
              <div
                key={notificareCos.id}
                className={styles.toast}
                role="status"
                aria-live="polite"
              >
                <div className={styles.toastText}>
                  <strong>✓ Adăugat în coș</strong>
                  <span>{notificareCos.titlu}</span>
                </div>
                <Link
                  to="/cos"
                  className={styles.toastLink}
                  onClick={onInchideNotificare}
                >
                  Vezi coșul →
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <ComparaBar
        compara={compara}
        onScoate={onScoateDinCompara}
        onGoleste={onGolesteCompara}
        onAdaugaInCos={onAdaugaInCos}
      />

      <footer className={styles.footer}>
        <span>Târg Local • Schimb, donații și vânzări în comunitate</span>
        <button type="button" className={styles.themeBtn} onClick={handleTema}>
          {tema === "dark" ? "☀️ Temă luminoasă" : "🌙 Temă întunecată"}
        </button>
      </footer>
    </div>
  );
}