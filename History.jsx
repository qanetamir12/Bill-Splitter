import { useEffect, useState } from "react";
import { api } from "../api.js";
import SettlementView, { rupees } from "../components/SettlementView.jsx";

export default function History() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listCalculations()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this saved calculation?")) return;
    try {
      await api.deleteCalculation(id);
      setItems((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container">
      <h1>📜 Your History</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p>No saved calculations yet. Split a bill and it will show up here.</p>
      )}

      {items.map((c) => (
        <div className="memberCard" key={c._id}>
          <div className="memberHead">
            <div>
              <h3>{c.title}</h3>
              <small>
                {new Date(c.createdAt).toLocaleString("en-IN")} · {c.members.length} people · {rupees(c.total)}
              </small>
            </div>
            <div>
              <button className="btn btn-light small" onClick={() => setOpenId(openId === c._id ? null : c._id)}>
                {openId === c._id ? "Hide" : "View"}
              </button>
              <button className="btn btn-red small" onClick={() => remove(c._id)}>Delete</button>
            </div>
          </div>

          {openId === c._id && (
            <>
              <SettlementView calc={c} />
              <p className="members-line">
                Paid: {c.members.map((m) => `${m.name} ${rupees(m.paid)}`).join(" · ")}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
