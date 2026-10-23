export const rupees = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SettlementView({ calc }) {
  return (
    <div className="result">
      <h2>Total = {rupees(calc.total)}</h2>
      <h3>Each Person Pays {rupees(calc.share)}</h3>

      {calc.settlements.length === 0 ? (
        <p className="resultLine">✅ Everyone is already settled up.</p>
      ) : (
        calc.settlements.map((s, i) => (
          <div className="resultLine" key={i}>
            💸 <b>{s.from}</b> pays <b>{rupees(s.amount)}</b> to <b>{s.to}</b>
          </div>
        ))
      )}
    </div>
  );
}
