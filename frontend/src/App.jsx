const produse = [
    { id: 1, titlu: "Bicicletă pentru copii", gata: false, eticheta: "Donatie" },
    { id: 2, titlu: "Culegere mate clasa a X-a", gata: true, eticheta: "Schimb" },
    { id: 3, titlu: "Monitor LCD vechi", gata: false, eticheta: "Donatie" }
];

export default function App() {
    const active = produse.filter((p) => !p.gata).length;

    return (
        <>
            <header>
                <h1>Marketplace Local</h1>
                <p>Găsește, donează sau schimbă obiecte utile în comunitatea ta.</p>
                <div className="counter">
                    {produse.length} anunțuri, dintre care {active} active
                </div>
            </header>

            <main className="container">
                <section className="panel">
                    <h2>Anunțuri recente</h2>
                    <pre>{JSON.stringify(produse, null, 2)}</pre>
                </section>
            </main>
        </>
    );
}