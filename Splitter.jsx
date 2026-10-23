import { useState } from "react";
import { api } from "../api.js";
import SettlementView from "../components/SettlementView.jsx";

export default function Splitter() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const addMember = () => {
    const n = name.trim();
    if (!n) return;
    if (members.some((m) => m.name.toLowerCase() === n.toLowerCase())) {
      setError(`"${n}" is already added`);
      return;
    }
    setError("");
    setMembers([...members, { name: n, paid: "" }]);
    setName("");
  };

  const updatePaid = (index, value) =>
    setMembers(members.map((m, i) => (i === index ? { ...m, paid: value } : m)));

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
    setResult(null);
  };

  const reset = () => {
    setTitle("");
    setMembers([]);
    setResult(null);
    setError("");
  };

  const calculate = async () => {
    setError("");
    if (members.length < 2) return setError("Add at least 2 people to split a bill");

    setBusy(true);
    try {
      const saved = await api.saveCalculation({
        title,
        members: members.map((m) => ({ name: m.name, paid: Number(m.paid) || 0 })),
      });
      setResult(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <h1>💰 Bill Splitter</h1>

      <div className="input-group">
        <label htmlFor="title">Bill Title (optional)</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Goa trip dinner" maxLength={80} />
      </div>

      <div className="input-group">
        <label htmlFor="person">Person Name</label>
        <input
          id="person"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addMember()}
          placeholder="Enter Name"
        />
      </div>

      <button className="btn btn-green" onClick={addMember}>Add Member</button>

      {members.map((m, i) => (
        <div className="memberCard" key={m.name}>
          <div className="memberHead">
            <h3>{m.name}</h3>
            <button className="btn-x" onClick={() => removeMember(i)} aria-label={`Remove ${m.name}`}>✕</button>
          </div>
          <label>Amount Paid (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={m.paid}
            placeholder="0"
            onChange={(e) => updatePaid(i, e.target.value)}
          />
        </div>
      ))}

      {error && <p className="error">{error}</p>}

      <div>
        <button className="btn btn-orange" onClick={calculate} disabled={busy}>
          {busy ? "Saving…" : "Calculate Settlement"}
        </button>
        {(members.length > 0 || result) && (
          <button className="btn btn-light" onClick={reset}>Start new bill</button>
        )}
      </div>

      {result && (
        <>
          <SettlementView calc={result} />
          <p className="saved-note">✔ Saved to your history</p>
        </>
      )}
    </div>
  );
}
