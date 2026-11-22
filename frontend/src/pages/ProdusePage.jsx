import { useEffect, useState } from "react";
import ProdusList from "../components/ProdusList.jsx";
import ProdusForm from "../components/ProdusForm.jsx";
import HartaProduse from "../components/HartaProduse.jsx";
import { createProdus, deleteProdus, fetchProduse, updateProdus } from "../api.js";
import { calculeazaImpactEco, extragePret } from "../constants.js";
import styles from "./ProdusePage.module.css";

const FILTRE = [
  { id: "toate", label: "Toate" },
  { id: "Vanzare", label: "Vânzare" },
  { id: "Schimb", label: "Schimb" },
  { id: "Donatie", label: "Donație" },
  { id: "favorite", label: "♥ Favorite" },
];

export default function ProdusePage({
  cos,
  favorite,
  compara,
  onToggleFavorite,
  onScoateDinFavorite,
  onToggleCompara,
  onScoateDinCompara,
  onAdaugaInCos,
  onScoateDinCos,
}) {
  const [produse, setProduse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modulBara, setModulBara] = useState("adauga"); // "adauga" | "cauta"
  const [modAfisare, setModAfisare] = useState("lista"); // "lista" | "harta"
  const [termenCautare, setTermenCautare] = useState("");
  const [filtruActiv, setFiltruActiv] = useState("toate");
  const [sortare, setSortare] = useState("recomandate");
  const [acum] = useState(() => Date.now());

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await fetchProduse();
        if (!ignore) setProduse(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleAdd(produs) {
    const creat = await createProdus(produs);
    setProduse((prev) => [...prev, creat]);
  }

  async function handleToggle(id) {
    const produs = produse.find((p) => p.id === id);
    try {
      const actualizat = await updateProdus(id, { gata: !produs.gata });
      setProduse((prev) => prev.map((p) => (p.id === id ? actualizat : p)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProdus(id);
      setProduse((prev) => prev.filter((p) => p.id !== id));
      onScoateDinFavorite(id);
      onScoateDinCos(id);
      if (onScoateDinCompara) onScoateDinCompara(id);
    } catch (err) {
      setError(err.message);
    }
  }

  const produseFiltrate = produse.filter((p) => {
    if (filtruActiv === "favorite" && !favorite.includes(p.id)) return false;
    if (
      filtruActiv !== "toate" &&
      filtruActiv !== "favorite" &&
      p.eticheta !== filtruActiv
    ) {
      return false;
    }

    const q = termenCautare.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.titlu ?? "").toLowerCase().includes(q) ||
      (p.zona ?? "").toLowerCase().includes(q) ||
      (p.descriere ?? "").toLowerCase().includes(q)
    );
  });

  const produseAfisate = [...produseFiltrate].sort((a, b) => {
    if (sortare === "pret-crescator") {
      return extragePret(a) - extragePret(b);
    }
    if (sortare === "pret-descrescator") {
      return extragePret(b) - extragePret(a);
    }
    if (sortare === "disponibile") {
      return Number(Boolean(a.gata)) - Number(Boolean(b.gata));
    }
    return 0;
  });

  const active = produse.filter((p) => !p.gata).length;
  const totalCo2Comunitate = produse.reduce(
    (sum, p) => sum + calculeazaImpactEco(p).co2Kg,
    0
  );

  return (
    <div className={styles.page}>
      <div className={styles.ecoStrip}>
        <div className={styles.ecoStat}>
          <span>🌱</span>
          <div>
            <strong>{totalCo2Comunitate} kg CO₂</strong>
            <small>potențial economisit de comunitate</small>
          </div>
        </div>
        <div className={styles.ecoStat}>
          <span>♻️</span>
          <div>
            <strong>{produse.length} obiecte</strong>
            <small>pregătite pentru o a doua viață</small>
          </div>
        </div>
        <div className={styles.ecoStat}>
          <span>🤝</span>
          <div>
            <strong>0% comision</strong>
            <small>schimb, donații și vânzări locale</small>
          </div>
        </div>
      </div>

      <section className={styles.commandBar}>
        <div className={styles.barTop}>
          <div className={styles.modeSwitch} role="tablist" aria-label="Mod bară">
            <button
              type="button"
              role="tab"
              aria-selected={modulBara === "cauta"}
              className={
                modulBara === "cauta"
                  ? `${styles.modeBtn} ${styles.modeActive}`
                  : styles.modeBtn
              }
              onClick={() => setModulBara("cauta")}
            >
              🔍 Caută
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={modulBara === "adauga"}
              className={
                modulBara === "adauga"
                  ? `${styles.modeBtn} ${styles.modeActive}`
                  : styles.modeBtn
              }
              onClick={() => setModulBara("adauga")}
            >
              ＋ Adaugă
            </button>
          </div>

          {modulBara === "cauta" ? (
            <div className={styles.searchWrap}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Caută produse, zone sau descrieri..."
                value={termenCautare}
                onChange={(e) => setTermenCautare(e.target.value)}
              />
              {termenCautare && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => setTermenCautare("")}
                  aria-label="Șterge căutarea"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <ProdusForm onAdd={handleAdd} />
          )}
        </div>

        <div className={styles.filterBar}>
          {FILTRE.map((f) => (
            <button
              key={f.id}
              type="button"
              className={
                filtruActiv === f.id
                  ? `${styles.chip} ${styles.chipActive}`
                  : styles.chip
              }
              onClick={() => setFiltruActiv(f.id)}
            >
              {f.id === "favorite" ? `${f.label} (${favorite.length})` : f.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <div>
            <h1>Am găsit {produseAfisate.length} rezultate pentru tine</h1>
            <span className={styles.activeCount}>{active} anunțuri active</span>
          </div>

          <div className={styles.controlsRight}>
            <div className={styles.viewToggle} role="group" aria-label="Mod afișare">
              <button
                type="button"
                className={
                  modAfisare === "lista"
                    ? `${styles.viewBtn} ${styles.viewActive}`
                    : styles.viewBtn
                }
                onClick={() => setModAfisare("lista")}
              >
                📋 Listă
              </button>
              <button
                type="button"
                className={
                  modAfisare === "harta"
                    ? `${styles.viewBtn} ${styles.viewActive}`
                    : styles.viewBtn
                }
                onClick={() => setModAfisare("harta")}
              >
                🗺️ Hartă
              </button>
            </div>

            <label className={styles.sortWrap}>
              <span>Sortează:</span>
              <select
                className={styles.sortSelect}
                value={sortare}
                onChange={(e) => setSortare(e.target.value)}
              >
                <option value="recomandate">Recomandate</option>
                <option value="disponibile">Disponibile întâi</option>
                <option value="pret-crescator">Preț crescător</option>
                <option value="pret-descrescator">Preț descrescător</option>
              </select>
            </label>
          </div>
        </div>

        {loading && (
          <p className="info" data-testid="loading">
            Se încarcă anunțurile...
          </p>
        )}

        {error && (
          <p className="error" data-testid="error">
            {error}
          </p>
        )}

        {!loading &&
          (modAfisare === "harta" ? (
            <HartaProduse
              produse={produseAfisate}
              onAdaugaInCos={onAdaugaInCos}
            />
          ) : (
            <ProdusList
              produse={produseAfisate}
              onToggle={handleToggle}
              onDelete={handleDelete}
              favorite={favorite}
              onToggleFavorite={onToggleFavorite}
              onAdaugaInCos={onAdaugaInCos}
              cos={cos}
              compara={compara}
              onToggleCompara={onToggleCompara}
              acum={acum}
            />
          ))}
      </section>
    </div>
  );
}