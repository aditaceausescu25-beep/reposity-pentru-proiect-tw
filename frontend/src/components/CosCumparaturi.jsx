export default function CosCumparaturi({ cos, onScoate }) {
  const total = cos.reduce((sum, item) => sum + (item.pretNumeric || 0), 0);

  return (
    <div className="cos-container">
      <h3>🛒 Coșul Meu</h3>
      {cos.length === 0 ? (
        <p className="cos-gol">Coșul este gol. Apasă pe un produs disponibil pentru a-l adăuga.</p>
      ) : (
        <>
          <ul className="cos-list">
            {cos.map((item) => (
              <li key={item.id} className="cos-item">
                <span>{item.titlu}</span>
                <span className="cos-pret">{item.pret}</span>
                <button className="btn-scoate" onClick={() => onScoate(item.id)}>✕</button>
              </li>
            ))}
          </ul>
          <div className="cos-total">
            <strong>Total estimat:</strong> <span>{total} RON</span>
          </div>
        </>
      )}
    </div>
  );
}