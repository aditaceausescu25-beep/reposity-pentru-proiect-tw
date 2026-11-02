import { useState } from "react";

export default function ProdusDetalii({ produs, onBack, onAdaugaInCos, onAdaugaOferta, onAlegePretFinal, isFavorite, onToggleFavorite }) {
  const [ofertaNoua, setOfertaNoua] = useState("");

  const oferteOrdrenate = [...produs.oferte].sort((a, b) => b.valoare - a.valoare);
  const ceaMaiBunaOferta = oferteOrdrenate.length > 0 ? oferteOrdrenate[0].valoare : 0;
  
  const ultimaOfertaUtilizator = produs.oferte.length > 0 ? produs.oferte[produs.oferte.length - 1].valoare : 0;
  const areOfertaMaiBuna = produs.oferte.length > 1 && ultimaOfertaUtilizator < ceaMaiBunaOferta;

  return (
    <div className="product-details-container">
      <div className="details-top-row">
        <button className="btn-back" onClick={onBack}>
          &larr; Înapoi la listă
        </button>
        
        <button 
          className={`btn-fav-details ${isFavorite ? 'is-fav' : ''}`}
          onClick={(e) => onToggleFavorite(produs.id, e)}
        >
          {isFavorite ? "♥ Salvat la favorite" : "♡ Adaugă la favorite"}
        </button>
      </div>
      
      <div className="details-card-normal">
        <div className="details-left-pane">
          <img src={produs.imagine} alt={produs.titlu} className="details-image-normal" />
          <div className="details-info-box">
            <h2>{produs.titlu}</h2>
            <div className="details-section">
              <h3>💰 Preț</h3>
              <p className="price-tag">{produs.pret}</p>
            </div>
            <div className="details-section">
              <h3>📝 Descriere detaliată</h3>
              <p>{produs.descriere}</p>
            </div>
            <div className="details-section">
              <h3>❓ Motivul înstrăinării</h3>
              <p>{produs.motivVanzare}</p>
            </div>
            <div className="details-section">
              <h3>📍 Locație / Zonă</h3>
              <p>{produs.zona}</p>
            </div>
            
            <div className={`status-banner ${produs.gata ? 'status-done' : 'status-active'}`}>
              {produs.gata ? "Acest produs nu mai este disponibil." : "Acest produs este disponibil!"}
            </div>

            {!produs.gata && (
              <button className="btn-adauga-cos-mare" onClick={() => onAdaugaInCos(produs)}>
                🛒 Adaugă în coșul tău
              </button>
            )}
          </div>
        </div>

        {produs.eticheta === "Vanzare" && (
          <div className="details-right-pane-licitare">
            <h3>🔨 Licitare și Oferte</h3>
            <p className="licitare-sub">Propune prețul tău pentru acest produs:</p>
            
            <div className="propunere-pret-box">
              <input 
                type="number" 
                placeholder="Sumă în RON" 
                value={ofertaNoua}
                onChange={(e) => setOfertaNoua(e.target.value)}
              />
              <button onClick={() => {
                if(ofertaNoua) {
                  onAdaugaOferta(produs.id, ofertaNoua);
                  setOfertaNoua("");
                }
              }}>Licitează</button>
            </div>

            {areOfertaMaiBuna && (
              <div className="alerta-oferta-buna">
                ⚠️ Atenție: Există o ofertă mai bună în listă!
              </div>
            )}

            <div className="lista-oferte">
              <h4>Istoric oferte primite:</h4>
              {produs.oferte.length === 0 ? (
                <p className="fara-oferte">Nu există nicio ofertă momentan. Fii primul!</p>
              ) : (
                <ul>
                  {oferteOrdrenate.map((of, index) => (
                    <li key={of.id} className={index === 0 ? "oferta-top" : ""}>
                      <span>{of.autor}: <strong>{of.valoare} RON</strong></span>
                      {!produs.gata && (
                        <button className="btn-alege-pret" onClick={() => onAlegePretFinal(produs.id, of.valoare)}>
                          Alege preț final
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}