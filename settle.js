/**
 * Equal bill split + minimal settlement.
 * All maths is done in paise (integers) so rounding never loses money.
 */
export function splitEqually(members) {
  const n = members.length;
  const paid = members.map((m) => Math.round(m.paid * 100));
  const totalPaise = paid.reduce((a, b) => a + b, 0);

  const base = Math.floor(totalPaise / n);
  const remainder = totalPaise - base * n; // leftover paise, handed out 1 each

  const creditors = [];
  const debtors = [];

  members.forEach((m, i) => {
    const owes = base + (i < remainder ? 1 : 0);
    const balance = paid[i] - owes;
    if (balance > 0) creditors.push({ name: m.name, amount: balance });
    else if (balance < 0) debtors.push({ name: m.name, amount: -balance });
  });

  const settlements = [];
  let d = 0;
  let c = 0;
  while (d < debtors.length && c < creditors.length) {
    const pay = Math.min(debtors[d].amount, creditors[c].amount);
    settlements.push({
      from: debtors[d].name,
      to: creditors[c].name,
      amount: pay / 100,
    });
    debtors[d].amount -= pay;
    creditors[c].amount -= pay;
    if (debtors[d].amount === 0) d++;
    if (creditors[c].amount === 0) c++;
  }

  return {
    total: totalPaise / 100,
    share: Math.round((totalPaise / n) ) / 100,
    settlements,
  };
}
