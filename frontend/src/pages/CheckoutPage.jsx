import { useState } from "react";
import { Link } from "react-router-dom";
import { updateProdus } from "../api.js";
import { calculeazaImpactEco, extragePret } from "../constants.js";
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage({ cos, onGolesteCos, onSalveazaComanda }) {
  const [nume, setNume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [oras, setOras] = useState("");
  const [adresa, setAdresa] = useState("");

  const [titularCard, setTitularCard] = useState("");
  const [numarCard, setNumarCard] = useState("");
  const [expirare, setExpirare] = useState("");
  const [cvv, setCvv] = useState("");

  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);
  const [confirmare, setConfirmare] = useState(null);

  const totalPret = cos.reduce(
    (sum, item) => sum + extragePret(item) * item.cantitate,
    0
  );
  const totalCo2 = cos.reduce(
    (sum, item) => sum + calculeazaImpactEco(item).co2Kg * item.cantitate,
    0
  );
  const necesitaCard = totalPret > 1;

  function formateazaCard(valoare) {
    const cifre = valoare.replace(/\D/g, "").slice(0, 16);
    return cifre.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function valideaza() {
    if (!nume.trim()) return "Te rugăm să introduci numele complet.";
    if (!telefon.trim() || telefon.replace(/\D/g, "").length < 9) {
      return "Introdu un număr de telefon valid.";
    }
    if (!oras.trim()) return "Te rugăm să introduci orașul.";
    if (!adresa.trim()) return "Te rugăm să introduci adresa completă de livrare.";

    if (necesitaCard) {
      if (!titularCard.trim()) return "Introdu numele titularului cardului.";
      if (numarCard.replace(/\s/g, "").length !== 16) {
        return "Numărul cardului trebuie să conțină exact 16 cifre.";
      }
      if (!/^\d{2}\/\d{2}$/.test(expirare.trim())) {
        return "Data expirării trebuie să fie în format LL/AA (ex: 09/28).";
      }
      if (!/^\d{3}$/.test(cvv.trim())) {
        return "Codul CVV trebuie să aibă 3 cifre.";
      }
    }

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

    try {
      await Promise.allSettled(
        cos.map((item) => updateProdus(item.id, { gata: true, rezervare: null }))
      );
    } finally {
      setTrimite(false);
    }

    const comandaNoua = {
      numar: Math.floor(100000 + Math.random() * 900000),
      data: new Date().toLocaleDateString("ro-RO"),
      nume: nume.trim(),
      adresaCompleta: `${adresa.trim()}, ${oras.trim()}`,
      total: totalPret,
      co2Economisit: totalCo2,
      platitCuCard: necesitaCard,
      produse: cos.map((item) => ({
        id: item.id,
        titlu: item.titlu,
        cantitate: item.cantitate,
        pret: item.pret ?? "Gratuit",
      })),
    };

    if (onSalveazaComanda) onSalveazaComanda(comandaNoua);
    setConfirmare(comandaNoua);
    onGolesteCos();
  }

  if (confirmare) {
    return (
      <section className={`panel ${styles.confirmBox}`}>
        <span className={styles.confirmIcon}>✓</span>
        <h1>Comanda #{confirmare.numar} a fost trimisă!</h1>
        <p className="info">
          Mulțumim, <strong>{confirmare.nume}</strong>. Produsele au fost rezervate și vor fi pregătite pentru livrare la adresa:{" "}
          <strong>{confirmare.adresaCompleta}</strong>.
        </p>
        <p className={styles.confirmMeta}>
          {confirmare.platitCuCard
            ? `Plată cu cardul confirmată: ${confirmare.total} RON`
            : `Comandă fără plată cu cardul (${confirmare.total} RON)`}
          {" • "}🌱 −{confirmare.co2Economisit} kg CO₂ economisiți
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/cont" className={`btn ${styles.homeBtn}`}>
            Vezi istoricul comenzilor →
          </Link>
          <Link to="/" className={styles.backLink} style={{ alignSelf: "center" }}>
            ← Înapoi la anunțuri
          </Link>
        </div>
      </section>
    );
  }

  if (cos.length === 0) {
    return (
      <section className={`panel ${styles.confirmBox}`}>
        <h2>Nu ai produse în coș</h2>
        <p className="info">Adaugă cel puțin un produs înainte de a trimite comanda.</p>
        <Link to="/" className={`btn ${styles.homeBtn}`}>
          Explorează anunțurile
        </Link>
      </section>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1>Finalizare comandă</h1>
        <Link to="/cos" className={styles.backLink}>
          ← Înapoi la coș
        </Link>
      </div>

      <div className={styles.grid}>
        <form className={`panel ${styles.form}`} onSubmit={handleSubmit} noValidate>
          <fieldset className={styles.fieldset}>
            <legend>1. Date de livrare</legend>

            <label>
              Nume complet
              <input
                type="text"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                placeholder="Ex: Andrei Popescu"
              />
            </label>

            <div className={styles.twoCols}>
              <label>
                Telefon
                <input
                  type="tel"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  placeholder="07xx xxx xxx"
                />
              </label>

              <label>
                Oraș / Localitate
                <input
                  type="text"
                  value={oras}
                  onChange={(e) => setOras(e.target.value)}
                  placeholder="Ex: București"
                />
              </label>
            </div>

            <label>
              Adresă de livrare
              <input
                type="text"
                value={adresa}
                onChange={(e) => setAdresa(e.target.value)}
                placeholder="Stradă, număr, bloc, scară, apartament"
              />
            </label>
          </fieldset>

          {necesitaCard ? (
            <fieldset className={styles.fieldset}>
              <legend>2. Datele cardului bancar</legend>
              <p className={styles.paymentNote}>
                Totalul comenzii depășește 1 leu ({totalPret} RON) — completează datele cardului pentru plată.
              </p>

              <label>
                Nume titular card
                <input
                  type="text"
                  value={titularCard}
                  onChange={(e) => setTitularCard(e.target.value)}
                  placeholder="ANDREI POPESCU"
                />
              </label>

              <label>
                Număr card
                <input
                  type="text"
                  inputMode="numeric"
                  value={numarCard}
                  onChange={(e) => setNumarCard(formateazaCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                />
              </label>

              <div className={styles.twoCols}>
                <label>
                  Expirare (LL/AA)
                  <input
                    type="text"
                    maxLength={5}
                    value={expirare}
                    onChange={(e) => setExpirare(e.target.value)}
                    placeholder="09/28"
                  />
                </label>

                <label>
                  CVV
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    placeholder="123"
                  />
                </label>
              </div>
            </fieldset>
          ) : (
            <div className={styles.freeBox}>
              <strong>✓ Nu este necesar cardul bancar</strong>
              <p>
                Totalul coșului este {totalPret} RON (nu depășește 1 leu), așa că este suficientă doar adresa de livrare.
              </p>
            </div>
          )}

          {eroare && <p className="error">{eroare}</p>}

          <button type="submit" className="btn" disabled={trimite}>
            {trimite
              ? "Se procesează comanda..."
              : necesitaCard
                ? `Plătește și trimite comanda (${totalPret} RON)`
                : "Confirmă și trimite comanda"}
          </button>
        </form>

        <aside className={`panel ${styles.summary}`}>
          <h2>Produsele tale</h2>
          <ul className={styles.summaryList}>
            {cos.map((item) => (
              <li key={item.id} className={styles.summaryItem}>
                <span>
                  {item.titlu} × {item.cantitate}
                </span>
                <strong>{extragePret(item) * item.cantitate} RON</strong>
              </li>
            ))}
          </ul>

          <div className={styles.totalRow}>
            <span>Total de plată</span>
            <strong>{totalPret} RON</strong>
          </div>
          <p className={styles.paymentNote}>
            🌱 Această comandă economisește ~{totalCo2} kg CO₂
          </p>
        </aside>
      </div>
    </div>
  );
}