const produse = [
    { id: 1, titlu: "Bicicletă pentru copii", gata: false, eticheta: "Donatie" },
    { id: 2, titlu: "Culegere mate clasa a X-a", gata: true, eticheta: "Schimb" },
    { id: 3, titlu: "Monitor LCD vechi", gata: false, eticheta: "Donatie" }
];

const TIPURI_OPERATIUNE = ["Donatie", "Schimb", "Vanzare"];
function listeazaTitluri(lista) {
    return lista.map((t) => t.titlu);
}

// 2. Numărarea elementelor active (disponibile)
function numaraActive(lista) {
    return lista.filter((t) => !t.gata).length;
}

// 3. Căutarea după titlu (ignorând majusculele/minusculele)
function cautaDupaTitlu(lista, text) {
    return lista.filter((t) => t.titlu.toLowerCase().includes(text.toLowerCase()));
}

// 4. Calcularea următorului ID unic
function nextId(lista) {
    return lista.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

// 5. Adăugarea unui element cu validare
function adaugaProdus(lista, titlu, eticheta = "Donatie") {
    const titluCurat = titlu ? titlu.trim() : "";
    if (!titluCurat) {
        console.log("Eroare: Titlul nu poate fi gol!");
        return lista;
    }
    if (!TIPURI_OPERATIUNE.includes(eticheta)) {
        console.log("Eroare: Tip operațiune invalid:", eticheta);
        return lista;
    }
    const produsNou = {
        id: nextId(lista),
        titlu: titluCurat,
        gata: false,
        eticheta: eticheta
    };
    return [...lista, produsNou];
}

// 6. Comutarea stării (activ / rezervat)
function comutaStatus(lista, id) {
    return lista.map((t) => (t.id === id ? { ...t, gata: !t.gata } : t));
}

// 7. Ștergerea unui element
function stergeProdus(lista, id) {
    return lista.filter((t) => t.id !== id);
}
console.log("--- Citire ---");
console.log("Titluri:", listeazaTitluri(produse).join(", "));
console.log("Active:", numaraActive(produse));
console.log("Căutare 'bicicletă':", listeazaTitluri(cautaDupaTitlu(produse, "bicicletă")).join(", "));

console.log("--- Adăugare ---");
let listaNoua = adaugaProdus(produse, "Aspirator vertical", "Schimb");
console.log("Lista nouă:", listaNoua.length, "produse");
console.log("Originalul a rămas cu:", produse.length, "produse");

console.log("--- Modificare și ștergere ---");
listaNoua = comutaStatus(listaNoua, 1);
console.log("După bifarea id 1, active:", numaraActive(listaNoua));
listaNoua = stergeProdus(listaNoua, 3);
console.log("După ștergerea id 3:", listeazaTitluri(listaNoua).join(", "));

console.log("--- Validare ---");
adaugaProdus(produse, "");
adaugaProdus(produse, "Test", "Invalid");