import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProdus, fetchProduse, updateProdus } from "../api.js";
import {
  ETICHETE,
  ETICHETE_LABEL,
  calculeazaImpactEco,
  formatTimpRamas,
} from "../constants.js";
import styles from "./ContPage.module.css";

export default function ContPage({
  comenzi = [],
  favorite = [],
  onToggleFavorite,
  onAdaugaInCos,
}) {
  const [tab, setTab] = useState("comenzi");
  const [produse, setProduse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acum] = useState(() => Date.now());

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    titlu: "",
    eticheta: "Vanzare",
    pret: "",
    zona: "",
    descriere: "",
  });
  const [salveazaEdit, setSalveazaEdit] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetchProduse()
      .then((data) => {
        if (!ignore && Array.isArray(data)) setProduse(data);
      })
      .catch(() => {
        // ignoră eroarea de încărcare
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const produseFavorite = produse.filter((p) => favorite.includes(p.id));
  const produseRezervate = produse.filter(
    (p) => !p.gata && Boolean(formatTimpRamas(p.rezervare?.expiraLa, acum))
  );

  const co2Personal = comenzi.reduce(
    (sum, c) => sum + (c.co2Economisit || 0),
    0
  );

  function pornesteEditare(produs) {
    setEditId(produs.id);
    setEditForm({
      titlu: produs.titlu ?? "",
      eticheta: produs.eticheta ?? "Vanzare",
      pret: produs.pret ?? "",
      zona: produs.zona ?? "",
      descriere: produs.descriere ?? "",
    });
  }

  async function salveazaModificari(e) {
    e.preventDefault();
    if (!editForm.titlu.trim() || editId === null) return;
    setSalveazaEdit(true);

    const match = String(editForm.pret).match(/(\d+(?:[.,]\d+)?)/);
    const pretNumeric =
      editForm.eticheta === "Vanzare" && match
        ? parseFloat(match[1].replace(",", "."))
        : 0;

    try {
      const actualizat = await updateProdus(editId, {
        titlu: editForm.titlu.trim(),
        eticheta: editForm.eticheta,
        pret: editForm.pret.trim() || (editForm.eticheta === "Donatie" ? "Gratuit" : "Schimb"),
        pretNumeric,
        zona: editForm.zona.trim() || "București",
        descriere: editForm.descriere.trim(),
      });
      setProduse((prev) =>
        prev.map((p) => (p.id === editId ? actualizat : p))
      );
      setEditId(null);
    } finally {
      setSalveazaEdit(false);
    }
  }

  async function stergeAnunt(id) {
    try {
      await deleteProdus(id);
      setProduse((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // ignoră eroarea
    }
  }

  return (
    <section className={styles.page}>
      <div className={`panel ${styles.profileBanner}`}>
        <div className={styles.profileLeft}>
          <div className={styles.avatar}>TL</div>
          <div>
            <h1>Contul meu Târg Local</h1>
            <p className="info" style={{ margin: 0 }}>
              Gestionează comenzile, favoritele, rezervările și anunțurile publicate
            </p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <strong>{comenzi.length}</strong>
            <span>Comenzi</span>
          </div>
          <div className={styles.statBox}>
            <strong>{favorite.length}</strong>
            <span>Favorite</span>
          </div>
          <div className={`${styles.statBox} ${styles.ecoBox}`}>
            <strong>🌱 {co2Personal} kg</strong>
            <span>CO₂ salvat</span>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={tab === "comenzi" ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setTab("comenzi")}
        >
          📦 Comenzile mele ({comenzi.length})
        </button>
        <button
          type="button"
          className={tab === "favorite" ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setTab("favorite")}
        >
          ♥ Favorite ({produseFavorite.length})
        </button>
        <button
          type="button"
          className={tab === "rezervari" ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setTab("rezervari")}
        >
          ⏳ Rezervări active ({produseRezervate.length})
        </button>
        <button
          type="button"
          className={tab === "anunturi" ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          onClick={() => setTab("anunturi")}
        >
          ✏️ Editează anunțuri ({produse.length})
        </button>
      </div>

      {tab === "comenzi" && (
        <div className="panel">
          {comenzi.length === 0 ? (
            <div className={styles.emptyBlock}>
              <p className="info">Nu ai plasat încă nicio comandă.</p>
              <Link to="/" className="btn" style={{ textDecoration: "none" }}>
                Explorează anunțurile
              </Link>
            </div>
          ) : (
            <ul className={styles.ordersList}>
              {comenzi.map((c) => (
                <li key={c.numar} className={styles.orderCard}>
                  <div className={styles.orderHead}>
                    <strong>Comanda #{c.numar}</strong>
                    <span>{c.data}</span>
                  </div>
                  <p className={styles.orderAddr}>
                    📍 {c.adresaCompleta} • {c.platitCuCard ? "Plătită cu cardul" : "Fără plată cu cardul"}
                  </p>
                  <ul className={styles.orderItems}>
                    {c.produse.map((p) => (
                      <li key={`${c.numar}-${p.id}`}>
                        {p.titlu} × {p.cantitate} ({p.pret})
                      </li>
                    ))}
                  </ul>
                  <div className={styles.orderFoot}>
                    <span className={styles.ecoText}>
                      🌱 −{c.co2Economisit || 0} kg CO₂
                    </span>
                    <strong>Total: {c.total} RON</strong>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "favorite" && (
        <div className="panel">
          {loading ? (
            <p className="info">Se încarcă...</p>
          ) : produseFavorite.length === 0 ? (
            <div className={styles.emptyBlock}>
              <p className="info">Nu ai niciun produs salvat la favorite.</p>
              <Link to="/" className="btn" style={{ textDecoration: "none" }}>
                Descoperă produse
              </Link>
            </div>
          ) : (
            <div className={styles.favGrid}>
              {produseFavorite.map((p) => (
                <div key={p.id} className={styles.favCard}>
                  {p.imagine && (
                    <img src={p.imagine} alt={p.titlu} className={styles.favImg} />
                  )}
                  <div className={styles.favBody}>
                    <Link to={`/produse/${p.id}`} className={styles.favTitle}>
                      {p.titlu}
                    </Link>
                    <strong>{p.pret ?? "Gratuit"}</strong>
                    <div className={styles.favActions}>
                      {!p.gata && (
                        <button
                          type="button"
                          className="btn"
                          onClick={() => onAdaugaInCos(p)}
                        >
                          + În coș
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => onToggleFavorite(p.id)}
                      >
                        Scoate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "rezervari" && (
        <div className="panel">
          {produseRezervate.length === 0 ? (
            <p className="info">
              Nu ai nicio rezervare activă. Poți rezerva un produs pentru 24h direct din pagina lui de detaliu.
            </p>
          ) : (
            <ul className={styles.manageList}>
              {produseRezervate.map((p) => (
                <li key={p.id} className={styles.manageRow}>
                  <div>
                    <Link to={`/produse/${p.id}`} className={styles.favTitle}>
                      {p.titlu}
                    </Link>
                    <p className={styles.subMeta}>
                      ⏳ {formatTimpRamas(p.rezervare?.expiraLa, acum)} rămase •{" "}
                      {p.rezervare.interval} • {p.rezervare.locatie}
                    </p>
                  </div>
                  <Link to={`/produse/${p.id}`} className="btn" style={{ textDecoration: "none" }}>
                    Vezi anunțul
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "anunturi" && (
        <div className="panel">
          {loading ? (
            <p className="info">Se încarcă anunțurile...</p>
          ) : (
            <ul className={styles.manageList}>
              {produse.map((p) => (
                <li key={p.id} className={styles.manageItem}>
                  {editId === p.id ? (
                    <form className={styles.editForm} onSubmit={salveazaModificari}>
                      <div className={styles.editGrid}>
                        <input
                          type="text"
                          value={editForm.titlu}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, titlu: e.target.value }))
                          }
                          placeholder="Titlu"
                        />
                        <select
                          value={editForm.eticheta}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              eticheta: e.target.value,
                            }))
                          }
                        >
                          {ETICHETE.map((et) => (
                            <option key={et.value} value={et.value}>
                              {et.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={editForm.pret}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, pret: e.target.value }))
                          }
                          placeholder="Preț (ex: 150 RON / Gratuit)"
                        />
                        <input
                          type="text"
                          value={editForm.zona}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, zona: e.target.value }))
                          }
                          placeholder="Zonă"
                        />
                      </div>
                      <input
                        type="text"
                        value={editForm.descriere}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            descriere: e.target.value,
                          }))
                        }
                        placeholder="Descriere"
                      />
                      <div className={styles.editActions}>
                        <button type="submit" className="btn" disabled={salveazaEdit}>
                          {salveazaEdit ? "Se salvează..." : "Salvează"}
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => setEditId(null)}
                        >
                          Renunță
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className={styles.manageRow}>
                      <div>
                        <Link to={`/produse/${p.id}`} className={styles.favTitle}>
                          {p.titlu}
                        </Link>
                        <p className={styles.subMeta}>
                          {ETICHETE_LABEL[p.eticheta] ?? p.eticheta} • {p.pret ?? "Gratuit"} •{" "}
                          📍 {p.zona ?? "Local"} • 🌱 −{calculeazaImpactEco(p).co2Kg} kg CO₂
                        </p>
                      </div>
                      <div className={styles.editActions}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => pornesteEditare(p)}
                        >
                          ✏️ Editează
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => stergeAnunt(p.id)}
                        >
                          Șterge
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}