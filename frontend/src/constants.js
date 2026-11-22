export const ETICHETE = [
  { value: "Vanzare", label: "Vânzare" },
  { value: "Schimb", label: "Schimb" },
  { value: "Donatie", label: "Donație" },
];

export const ETICHETE_LABEL = Object.fromEntries(
  ETICHETE.map((e) => [e.value, e.label])
);

export function extragePret(produs) {
  if (!produs) return 0;
  if (typeof produs.pretNumeric === "number" && !Number.isNaN(produs.pretNumeric)) {
    return produs.pretNumeric;
  }
  const text = String(produs.pret ?? "").toLowerCase();
  if (text.includes("gratuit") || text.includes("schimb")) return 0;
  const match = text.match(/(\d+(?:[.,]\d+)?)/);
  return match ? parseFloat(match[1].replace(",", ".")) : 0;
}

export function calculeazaImpactEco(produs) {
  const text = `${produs?.titlu ?? ""} ${produs?.descriere ?? ""}`.toLowerCase();
  if (/biciclet|trotinet|scuter/.test(text)) return { co2Kg: 38, categorie: "Mobilitate" };
  if (/monitor|laptop|pc|telefon|tablet|tv|televizor|imprimant/.test(text)) {
    return { co2Kg: 46, categorie: "Electronice" };
  }
  if (/aspirator|cuptor|frigider|masin|electrocasnic|expresor/.test(text)) {
    return { co2Kg: 32, categorie: "Electrocasnice" };
  }
  if (/scaun|masa|birou|dulap|canapea|pat|mobil/.test(text)) {
    return { co2Kg: 28, categorie: "Mobilier" };
  }
  if (/oale|tiga|vase|bucatar|inox|farfur/.test(text)) {
    return { co2Kg: 15, categorie: "Casă & Bucătărie" };
  }
  if (/carte|carti|culeger|manual|roman|joc/.test(text)) {
    return { co2Kg: 6, categorie: "Educație & Lectură" };
  }
  if (/haine|geaca|palton|pantofi|adidasi|rucsac/.test(text)) {
    return { co2Kg: 14, categorie: "Modă circulară" };
  }
  return { co2Kg: 12, categorie: "Obiect reutilizat" };
}

export function obtineGalerie(produs) {
  if (Array.isArray(produs?.imagini) && produs.imagini.length > 0) {
    return produs.imagini.map((url, idx) => ({
      url,
      label: `Foto ${idx + 1}`,
      position: "center center",
      scale: 1,
    }));
  }
  if (!produs?.imagine) return [];
  return [
    {
      url: produs.imagine,
      label: "Vedere completă",
      position: "center center",
      scale: 1,
    },
    {
      url: produs.imagine,
      label: "Detaliu prim-plan",
      position: "30% 42%",
      scale: 1.4,
    },
    {
      url: produs.imagine,
      label: "Textură & finisaj",
      position: "72% 58%",
      scale: 1.5,
    },
  ];
}

export function normalizeazaJudet(text) {
  const curat = String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (curat === "bucharest") return "bucuresti";
  return curat;
}

export const CODURI_JUDETE = {
  alba: "AB",
  arad: "AR",
  arges: "AG",
  bacau: "BC",
  bihor: "BH",
  bistritanasaud: "BN",
  botosani: "BT",
  braila: "BR",
  brasov: "BV",
  bucuresti: "B",
  buzau: "BZ",
  calarasi: "CL",
  carasseverin: "CS",
  cluj: "CJ",
  constanta: "CT",
  covasna: "CV",
  dambovita: "DB",
  dolj: "DJ",
  galati: "GL",
  giurgiu: "GR",
  gorj: "GJ",
  harghita: "HR",
  hunedoara: "HD",
  ialomita: "IL",
  iasi: "IS",
  ilfov: "IF",
  maramures: "MM",
  mehedinti: "MH",
  mures: "MS",
  neamt: "NT",
  olt: "OT",
  prahova: "PH",
  salaj: "SJ",
  satumare: "SM",
  sibiu: "SB",
  suceava: "SV",
  teleorman: "TR",
  timis: "TM",
  tulcea: "TL",
  valcea: "VL",
  vaslui: "VS",
  vrancea: "VN",
};

const REGULI_JUDETE = [
  {
    key: "bucuresti",
    match:
      /bucure|bucharest|sector\s*[1-6]|dristor|titan|militari|drumul taberei|berceni|crangasi|obor|pipera|cotroceni|tineretului|vitan|colentina|rahova/i,
  },
  {
    key: "ilfov",
    match: /ilfov|otopeni|voluntari|popesti|chiajna|pantelimon|bragadiru|buftea/i,
  },
  { key: "cluj", match: /cluj|turda|dej|floresti/i },
  { key: "timis", match: /timis|lugoj/i },
  { key: "brasov", match: /brasov|fagaras|sacele|rasnov|predeal/i },
  { key: "iasi", match: /iasi|pascani/i },
  { key: "constanta", match: /constanta|mangalia|medgidia|navodari|mamaia/i },
  { key: "dolj", match: /dolj|craiova|bailesti|calafat/i },
  { key: "bihor", match: /bihor|oradea|beius|salonta/i },
  { key: "sibiu", match: /sibiu|medias/i },
  { key: "prahova", match: /prahova|ploiesti|campina|sinaia|busteni/i },
  { key: "arges", match: /arges|pitesti|curtea de arges|campulung|mioveni/i },
  { key: "arad", match: /arad/i },
  { key: "alba", match: /alba|sebes|aiud|blaj/i },
  { key: "bacau", match: /bacau|onesti|moinesti/i },
  { key: "bistritanasaud", match: /bistrita|nasaud/i },
  { key: "botosani", match: /botosani|dorohoi/i },
  { key: "braila", match: /braila/i },
  { key: "buzau", match: /buzau|ramnicu sarat/i },
  { key: "calarasi", match: /calarasi|oltenita/i },
  { key: "carasseverin", match: /caras|resita|caransebes/i },
  { key: "covasna", match: /covasna|sfantu gheorghe/i },
  { key: "dambovita", match: /dambovita|targoviste|moreni/i },
  { key: "galati", match: /galati|tecuci/i },
  { key: "giurgiu", match: /giurgiu/i },
  { key: "gorj", match: /gorj|targu jiu/i },
  { key: "harghita", match: /harghita|miercurea ciuc|odorheiu/i },
  { key: "hunedoara", match: /hunedoara|deva|petrosani/i },
  { key: "ialomita", match: /ialomita|slobozia|urziceni/i },
  { key: "maramures", match: /maramures|baia mare|sighet/i },
  { key: "mehedinti", match: /mehedinti|drobeta|turnu severin/i },
  { key: "mures", match: /mures|sighisoara|reghin/i },
  { key: "neamt", match: /neamt|piatra neamt|roman/i },
  { key: "olt", match: /olt|slatina|caracal/i },
  { key: "salaj", match: /salaj|zalau/i },
  { key: "satumare", match: /satu mare|carei/i },
  { key: "suceava", match: /suceava|radauti|falticeni|campulung moldovenesc/i },
  { key: "teleorman", match: /teleorman|alexandria|rosiori|turnu magurele/i },
  { key: "tulcea", match: /tulcea|macin|sulina/i },
  { key: "valcea", match: /valcea|dragasani|calimanesti/i },
  { key: "vaslui", match: /vaslui|barlad|husi/i },
  { key: "vrancea", match: /vrancea|focsani|adjud/i },
];

export function detecteazaJudet(zona) {
  const faraDiacritice = String(zona ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const gasit = REGULI_JUDETE.find((r) => r.match.test(faraDiacritice));
  return gasit ? gasit.key : "bucuresti";
}

export function formatTimpRamas(expiraLa, acum) {
  if (!expiraLa) return "";
  const diff = expiraLa - acum;
  if (diff <= 0) return "";
  const ore = Math.floor(diff / (1000 * 60 * 60));
  const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${ore}h ${minute}m`;
}