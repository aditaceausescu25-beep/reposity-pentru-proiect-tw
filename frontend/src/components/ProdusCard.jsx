const ETICHETE_OPERATIUNE = {
    Donatie: "Donație",
    Schimb: "Schimb",
    Vanzare: "Vânzare"
};

export default function ProdusCard({ produs }) {
    return (
        <li className={produs.gata ? "object-item done" : "object-item"}>
            <div className="object-details">
                <span className={`badge ${produs.eticheta.toLowerCase()}`}>
                    {ETICHETE_OPERATIUNE[produs.eticheta] || produs.eticheta}
                </span>
                <span className="object-title">{produs.titlu}</span>
            </div>
            <span className={produs.gata ? "status reserved" : "status active"}>
                {produs.gata ? "Rezervat" : "Disponibil"}
            </span>
        </li>
    );
}