import { useState } from "react";
import { ETICHETE } from "../constants.js";
import styles from "./ProdusForm.module.css";

const TITLU_MAX = 100;
const IMAGINE_IMPLICITA =
  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80";

export default function ProdusForm({ onAdd }) {
  const [titlu, setTitlu] = useState("");
  const [eticheta, setEticheta] = useState("Vanzare");
  const [pretInput, setPretInput] = useState("");
  const [arataExtra, setArataExtra] = useState(false);
  const [zona, setZona] = useState("");
  const [descriere, setDescriere] = useState("");
  const [motivVanzare, setMotivVanzare] = useState("");
  const [imagine, setImagine] = useState("");
  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  function valideaza() {
    const t = titlu.trim();
    if (t === "") return "Titlul este obligatoriu.";
    if (t.length > TITLU_MAX) return `Titlul are maximum ${TITLU_MAX} de caractere.`;
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const mesaj = valideaza();

    if (mesaj) {
      setEroare(mesaj);
      return;
    }

    setEroare("");
    setTrimite(true);

    const numarPret =
      eticheta === "Vanzare" && pretInput.trim() !== ""
        ? Math.max(0, Number(pretInput) || 0)
        : 0;

    const textPret =
      eticheta === "Donatie"
        ? "Gratuit"
        : eticheta === "Schimb"
          ? "Schimb"
          : numarPret > 0
            ? `${numarPret} RON`
            : "0 RON";

    try {
      await onAdd({
        titlu: titlu.trim(),
        eticheta,
        gata: false,
        pret: textPret,
        pretNumeric: numarPret,
        descriere:
          descriere.trim() ||
          "Anunț publicat recent de un membru al comunității.",
        motivVanzare: motivVanzare.trim() || "-",
        zona: zona.trim() || "București",
        imagine: imagine.trim() || IMAGINE_IMPLICITA,
        oferte: [],
      });
      setTitlu("");
      setEticheta("Vanzare");
      setPretInput("");
      setZona("");
      setDescriere("");
      setMotivVanzare("");
      setImagine("");
      setArataExtra(false);
    } catch (err) {
      setEroare(err.message);
    } finally {
      setTrimite(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate data-testid="form">
      <div className={styles.fields}>
        <input
          type="text"
          className={styles.input}
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          placeholder="Scrie titlul produsului pe care vrei să îl publici..."
          aria-label="Titlu"
          maxLength={TITLU_MAX}
          aria-invalid={Boolean(eroare)}
          data-testid="form-title"
        />

        <select
          className={styles.select}
          value={eticheta}
          onChange={(e) => setEticheta(e.target.value)}
          aria-label="Etichetă"
          data-testid="form-eticheta"
        >
          {ETICHETE.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {eticheta === "Vanzare" && (
          <input
            type="number"
            min="0"
            className={styles.priceInput}
            value={pretInput}
            onChange={(e) => setPretInput(e.target.value)}
            placeholder="Preț (RON)"
            aria-label="Preț în RON"
          />
        )}

        <button
          type="button"
          className={styles.extraToggle}
          onClick={() => setArataExtra((prev) => !prev)}
        >
          {arataExtra ? "− Ascunde detalii" : "+ Detalii"}
        </button>

        <button
          type="submit"
          className={`btn ${styles.submitBtn}`}
          disabled={trimite}
          data-testid="form-submit"
        >
          {trimite ? "Se salvează..." : "Publică"}
        </button>
      </div>

      {arataExtra && (
        <div className={styles.extraGrid}>
          <input
            type="text"
            className={styles.extraInput}
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            placeholder="Zonă / Oraș (ex: Cluj-Napoca)"
            aria-label="Zonă"
          />
          <input
            type="text"
            className={styles.extraInput}
            value={motivVanzare}
            onChange={(e) => setMotivVanzare(e.target.value)}
            placeholder="Motiv (ex: Nu îl mai folosesc)"
            aria-label="Motiv vânzare"
          />
          <input
            type="url"
            className={styles.extraInput}
            value={imagine}
            onChange={(e) => setImagine(e.target.value)}
            placeholder="Link imagine (opțional, https://...)"
            aria-label="URL imagine"
          />
          <input
            type="text"
            className={styles.extraInput}
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
            placeholder="Scurtă descriere a produsului..."
            aria-label="Descriere"
          />
        </div>
      )}

      {eroare && (
        <p className="error" data-testid="form-error">
          {eroare}
        </p>
      )}
    </form>
  );
}