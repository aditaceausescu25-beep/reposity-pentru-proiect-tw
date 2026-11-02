import { useState } from "react";
import ProdusList from "./components/ProdusList.jsx";
import ProdusDetalii from "./components/ProdusDetalii.jsx";
import "./App.css";

const PRODUSE_INITIALE = [
  { 
    id: 1, 
    titlu: "Bicicletă pentru copii", 
    gata: false, 
    eticheta: "Donatie", 
    pret: "Gratuit", 
    pretNumeric: 0, 
    descriere: "Stare excelentă, potrivită pentru copii de 5-8 ani.", 
    motivVanzare: "Copilul a crescut.", 
    zona: "Sector 3, Dristor", 
    imagine: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 2, 
    titlu: "Culegere mate clasa a X-a", 
    gata: true, 
    eticheta: "Schimb", 
    pret: "Schimb", 
    pretNumeric: 0, 
    descriere: "Editura Paralela 45, completă.", 
    motivVanzare: "Am terminat liceul.", 
    zona: "Cluj-Napoca", 
    imagine: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 3, 
    titlu: "Monitor LCD vechi", 
    gata: false, 
    eticheta: "Vanzare", 
    pret: "150 RON", 
    pretNumeric: 150, 
    descriere: "Diagonala 19 inch, perfect funcțional.", 
    motivVanzare: "Upgrade la 27 inch.", 
    zona: "București, Sector 6", 
    imagine: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80", 
    oferte: [{ id: 1, valoare: 130, autor: "Mihai" }] 
  },
  { 
    id: 4, 
    titlu: "Set de oale inox", 
    gata: false, 
    eticheta: "Donatie", 
    pret: "Gratuit", 
    pretNumeric: 0, 
    descriere: "Folosite, dar în stare bună.", 
    motivVanzare: "Eliberăm spațiul.", 
    zona: "Brașov", 
    imagine: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 5, 
    titlu: "Aspirator vertical", 
    gata: false, 
    eticheta: "Vanzare", 
    pret: "250 RON", 
    pretNumeric: 250, 
    descriere: "Putere 600W, ideal pentru spații mici.", 
    motivVanzare: "Mutare.", 
    zona: "Timișoara", 
    imagine: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=500&q=80", 
    oferte: [{ id: 1, valoare: 220, autor: "Elena" }] 
  },
  { 
    id: 6, 
    titlu: "Chitară acustică Yamaha", 
    gata: false, 
    eticheta: "Vanzare", 
    pret: "400 RON", 
    pretNumeric: 400, 
    descriere: "Model entry-level, corzi noi schimbate.", 
    motivVanzare: "Trec la chitară electrică.", 
    zona: "Iași, Copou", 
    imagine: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 7, 
    titlu: "Pătuț bebe pliant", 
    gata: false, 
    eticheta: "Donatie", 
    pret: "Gratuit", 
    pretNumeric: 0, 
    descriere: "Include saltea suplimentară și geantă de transport.", 
    motivVanzare: "Nu mai călătorim cu cel mic.", 
    zona: "Constanța, Tomis", 
    imagine: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 8, 
    titlu: "Espressor cafea cu capsule", 
    gata: false, 
    eticheta: "Vanzare", 
    pret: "200 RON", 
    pretNumeric: 200, 
    descriere: "Folosit 6 luni, stare impecabilă de funcționare.", 
    motivVanzare: "Primit cadou un espressor automat.", 
    zona: "Sibiu, Centru", 
    imagine: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 9, 
    titlu: "Set 4 anvelope de iarnă", 
    gata: false, 
    eticheta: "Vanzare", 
    pret: "600 RON", 
    pretNumeric: 600, 
    descriere: "Dimensiune 195/65/R15, rulate un singur sezon.", 
    motivVanzare: "Am schimbat mașina.", 
    zona: "Oradea", 
    imagine: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 10, 
    titlu: "Rucsac munte 50L", 
    gata: false, 
    eticheta: "Schimb", 
    pret: "Schimb", 
    pretNumeric: 0, 
    descriere: "Impermeabil, cu husă de ploaie inclusă.", 
    motivVanzare: "Prea mare pentru drumețiile mele scurte. Caut ceva de 30L.", 
    zona: "Brașov, Noua", 
    imagine: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 11, 
    titlu: "Trotinetă electrică", 
    gata: false, 
    eticheta: "Vanzare", 
    pret: "900 RON", 
    pretNumeric: 900, 
    descriere: "Autonomie 25 km, viteză maximă 25 km/h.", 
    motivVanzare: "Trecere la bicicletă.", 
    zona: "București, Titan", 
    imagine: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 12, 
    titlu: "Lustră modernă sufragerie", 
    gata: false, 
    eticheta: "Donatie", 
    pret: "Gratuit", 
    pretNumeric: 0, 
    descriere: "Design minimalist cu 3 becuri LED incluse.", 
    motivVanzare: "Renovare și schimbare design interior.", 
    zona: "Craiova", 
    imagine: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 13, 
    titlu: "Bibliotecă lemn masiv", 
    gata: false, 
    eticheta: "Schimb", 
    pret: "Schimb", 
    pretNumeric: 0, 
    descriere: "Culoare nuc, lungime 2 metri, stare foarte bună.", 
    motivVanzare: "Reamenajare cameră.", 
    zona: "Pitești", 
    imagine: "https://images.unsplash.com/photo-1594626119520-e2434d284f93?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 14, 
    titlu: "Skateboard profesional", 
    gata: false, 
    eticheta: "Vanzare", 
    pret: "120 RON", 
    pretNumeric: 120, 
    descriere: "Placă din arțar canadian, roți poliuretan.", 
    motivVanzare: "Nu l-am folosit niciodată.", 
    zona: "Galați", 
    imagine: "https://images.unsplash.com/photo-1547447134-cd3f5c716027?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  },
  { 
    id: 15, 
    titlu: "Set 6 pahare de cristal", 
    gata: false, 
    eticheta: "Donatie", 
    pret: "Gratuit", 
    pretNumeric: 0, 
    descriere: "Primit cadou, nefolosite, în cutia originală.", 
    motivVanzare: "Nu consumăm băuturi fine.", 
    zona: "Arad", 
    imagine: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80", 
    oferte: [] 
  }
];
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [produse, setProduse] = useState(PRODUSE_INITIALE);
  const [tema, setTema] = useState(temaInitiala);
  const [termenCautare, setTermenCautare] = useState("");
  const [produsSelectat, setProdusSelectat] = useState(null);
  const [cos, setCos] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [arataFavorite, setArataFavorite] = useState(false);

  function handleToggle(id) {
    setProduse((prev) => prev.map((p) => (p.id === id ? { ...p, gata: !p.gata } : p)));
    if (produsSelectat && produsSelectat.id === id) {
      setProdusSelectat(prev => ({...prev, gata: !prev.gata}));
    }
  }

  function handleDelete(id) {
    setProduse((prev) => prev.filter((p) => p.id !== id));
    if (produsSelectat && produsSelectat.id === id) setProdusSelectat(null);
    setCos((prev) => prev.filter((item) => item.id !== id));
    setFavorite((prev) => prev.filter((favId) => favId !== id));
  }

  function toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    setFavorite(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  }

  function adaugaOferta(idProdus, valoareOferta) {
    const nouaOferta = { id: Date.now(), valoare: Number(valoareOferta), autor: "Utilizator" };
    setProduse(prev => prev.map(p => {
      if (p.id === idProdus) {
        const updatedOferte = [...p.oferte, nouaOferta];
        const updatedProdus = { ...p, oferte: updatedOferte };
        if (produsSelectat && produsSelectat.id === idProdus) {
          setProdusSelectat(updatedProdus);
        }
        return updatedProdus;
      }
      return p;
    }));
  }

  function alegePretFinal(idProdus, valoareFinala) {
    setProduse(prev => prev.map(p => {
      if (p.id === idProdus) {
        const updatedProdus = { ...p, pret: `${valoareFinala} RON (Vândut)`, pretNumeric: Number(valoareFinala), gata: true };
        if (produsSelectat && produsSelectat.id === idProdus) {
          setProdusSelectat(updatedProdus);
        }
        return updatedProdus;
      }
      return p;
    }));
  }

  function adaugaInCos(produs) {
    if (produs.gata) return;
    if (!cos.some(item => item.id === produs.id)) {
      setCos([...cos, produs]);
    }
  }

  function scoateDinCos(id) {
    setCos(cos.filter(item => item.id !== id));
  }

  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  const produseBaza = arataFavorite ? produse.filter(p => favorite.includes(p.id)) : produse;
  const produseFiltrate = produseBaza.filter(p => 
    p.titlu.toLowerCase().includes(termenCautare.toLowerCase()) || 
    p.zona.toLowerCase().includes(termenCautare.toLowerCase())
  );
  
  const active = produse.filter((p) => !p.gata).length;
  const totalCos = cos.reduce((sum, item) => sum + (item.pretNumeric || 0), 0);

  return (
    <>
      <header className="app-header">
        {/* Bara de sus cu meniu, căutare, favorite și coș */}
        <div className="top-navigation-bar">
          <button className={`nav-pill ${!arataFavorite ? 'active-pill' : ''}`} onClick={() => { setArataFavorite(false); setProdusSelectat(null); }}>
            🏠 Toate Anunțurile
          </button>
          
          <button className={`nav-pill ${arataFavorite ? 'active-pill' : ''}`} onClick={() => { setArataFavorite(true); setProdusSelectat(null); }}>
            ❤ Favorite ({favorite.length})
          </button>

          <div className="top-right-cart">
            <div className="cart-widget-header">
              🛒 Coș: <strong>{cos.length}</strong> produse ({totalCos} RON)
            </div>
            {cos.length > 0 && (
              <div className="cart-dropdown">
                {cos.map(item => (
                  <div key={item.id} className="cart-drop-item">
                    <span>{item.titlu}</span>
                    <button onClick={() => scoateDinCos(item.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p>Economie circulară în comunitatea ta</p>
        <div className="counter">{produse.length} anunțuri, dintre care {active} active</div>
        
        {!produsSelectat && (
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Caută după produs sau zonă..." 
              value={termenCautare}
              onChange={(e) => setTermenCautare(e.target.value)}
            />
          </div>
        )}
      </header>

      <main className="container">
        {produsSelectat ? (
          <ProdusDetalii 
            produs={produsSelectat} 
            onBack={() => setProdusSelectat(null)} 
            onAdaugaInCos={adaugaInCos}
            onAdaugaOferta={adaugaOferta}
            onAlegePretFinal={alegePretFinal}
            isFavorite={favorite.includes(produsSelectat.id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <ProdusList 
            produse={produseFiltrate} 
            onToggle={handleToggle} 
            onDelete={handleDelete} 
            onSelect={setProdusSelectat}
            favorite={favorite}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>

      <footer className="app-footer-subtle">
        <button className="theme-toggle-subtle" onClick={handleTema}>
          {tema === "dark" ? "☀️ Mod luminos" : "🌙 Mod întunecat"}
        </button>
      </footer>
    </>
  );
}