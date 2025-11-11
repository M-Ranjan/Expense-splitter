
import { Person, Expense, Balance, Settlement } from "../types";
// this for the calulation functions helps avoid floating point precision issues

const toCents = (d: number) => Math.round(d * 100);
const toDollars = (c: number) => +(c / 100).toFixed(2);


export const calculateBalances = (people: Person[], expenses: Expense[]): Balance[] => {
  const map: Record<string, Balance & { _paidC: number; _owesC: number }> = {};
  people.forEach(p => {
    map[p.id] = { personId: p.id, personName: p.name, paid: 0, owes: 0, balance: 0, _paidC: 0, _owesC: 0 };
  });


  expenses.forEach(exp => {
    const totalC = toCents(exp.amount);
    if (map[exp.paidBy]) {
      map[exp.paidBy]._paidC += totalC;
      map[exp.paidBy].paid += toDollars(totalC);
    }
    exp.splits.forEach(s => {
      const splitC = toCents(s.amount);
      if (map[s.personId]) {
        map[s.personId]._owesC += splitC;
        map[s.personId].owes += toDollars(splitC);
      }
    });
  });


  return Object.values(map).map(item => ({
    personId: item.personId,
    personName: item.personName,
    paid: toDollars(item._paidC),
    owes: toDollars(item._owesC),
    balance: toDollars(item._paidC - item._owesC),
  }));
};


export const calculateSettlements = (balances: Balance[]): Settlement[] => {
  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({ ...b, c: Math.round(b.balance * 100) }))
    .sort((a, b) => b.c - a.c);


  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({ ...b, c: Math.round(b.balance * 100) }))
    .sort((a, b) => a.c - b.c);


  const settlements: Settlement[] = [];
  let i = 0, j = 0;


  while (i < creditors.length && j < debtors.length) {
    const c = creditors[i];
    const d = debtors[j];
    const amtC = Math.min(c.c, -d.c);




    if (amtC > 0) {
      settlements.push({
        from: d.personName,
        to: c.personName,
        amount: toDollars(amtC),
      });
      c.c -= amtC;
      d.c += amtC;
    }


    if (c.c <= 0) i++;
    if (d.c >= 0) j++;
  }


  return settlements;
};
