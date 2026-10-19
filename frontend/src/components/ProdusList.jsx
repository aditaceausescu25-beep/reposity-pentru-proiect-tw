import ProdusCard from "./ProdusCard.jsx";

export default function ProdusList({ produse }) {
    // 1. Verificăm dacă lista este goală
    if (produse.length === 0) {
        return <p className="empty">Nu există niciun anunț.</p>;
    }

    // 2. Altfel, randăm lista de carduri cu map și key unic
    return (
        <ul className="object-list">
            {produse.map((produs) => (
                <ProdusCard key={produs.id} produs={produs} />
            ))}
        </ul>
    );
}