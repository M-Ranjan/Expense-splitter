import React, { useState, useEffect, useRef } from "react";
import { Person, Expense, ExpenseSplit } from "../types";


interface Props {
  people: Person[];
  onAddExpense: (expense: Omit<Expense, "id">) => void;
}


const ExpenseForm: React.FC<Props> = ({ people, onAddExpense }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");


  // refs to inputs so we can focus safely when they appear
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});


  const togglePerson = (id: string) => {
    setSelected(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
        // ensure key exists for stable controlled input (avoids uncontrolled -> controlled warnings)
        setCustomAmounts(prevAmounts => {
          if (id in prevAmounts) return prevAmounts;
          return { ...prevAmounts, [id]: "" };
        });
      }
      return updated;
    });
  };


  // when in custom mode and selection changes, focus the last-added input safely
  useEffect(() => {
    if (splitType !== "custom") return;
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const last = ids[ids.length - 1];
    const el = inputRefs.current[last];
    if (!el) return;
    try {
      el.focus();
      // DO NOT call setSelectionRange on number inputs — some browsers throw.
      // We intentionally avoid selection manipulation to be cross-browser safe.
    } catch (err) {
      // ignore focus errors — don't crash the app
      // console.debug("focus error", err);
    }
  }, [selected, splitType]);


  const handleAdd = () => {
    setError("");
    const total = parseFloat(amount);
    if (!description.trim() || !total || !paidBy || selected.size === 0) {
      setError("Please fill all fields");
      return;
    }


    const totalCents = Math.round(total * 100);
    let splits: ExpenseSplit[] = [];


    if (splitType === "equal") {
      const ids = Array.from(selected);
      const base = Math.floor(totalCents / ids.length);
      let remainder = totalCents - base * ids.length;
      splits = ids.map((id) => {
        const extra = remainder > 0 ? 1 : 0;
        if (extra) remainder--;
        return { personId: id, amount: (base + extra) / 100 };
      });
    } else {
      const ids = Array.from(selected);
      splits = ids.map((id) => ({
        personId: id,
        amount: parseFloat(customAmounts[id] || "0"),
      }));


      const customSum = splits.reduce((sum, s) => sum + Math.round(s.amount * 100), 0);
      if (customSum !== totalCents) {
        setError(
          `Custom amounts ($${(customSum / 100).toFixed(
            2
          )}) must equal total amount ($${(totalCents / 100).toFixed(2)})`
        );
        return;
      }
    }


    onAddExpense({
      description: description.trim(),
      amount: total,
      paidBy,
      date,
      splitType,
      splits,
    });


    // Reset
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSelected(new Set());
    setCustomAmounts({});
  };


  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
        💸 Add Expense
      </h2>


      {/* Description */}
      <input
        type="text"
        placeholder="What was the expense for?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-md px-3 py-2 mb-3 text-gray-800 focus:border-indigo-500 outline-none"
      />


      {/* Amount + Date */}
      <div className="flex gap-4 mb-3">
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-md px-3 py-2 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="w-44">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-md px-3 py-2 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>


      {/* Paid By */}
      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-md px-3 py-2 mb-3 text-gray-800 focus:border-indigo-500 outline-none"
      >
        <option value="">Select person...</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>


      {/* Split Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Split Type</label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <input
              type="radio"
              checked={splitType === "equal"}
              onChange={() => setSplitType("equal")}
            />
            Equal Split
          </label>
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <input
              type="radio"
              checked={splitType === "custom"}
              onChange={() => setSplitType("custom")}
            />
            Custom Amounts
          </label>
        </div>
      </div>


      {/* Split Between */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Split Between</label>
        {people.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md mb-2 hover:bg-gray-100 transition-colors"
          >
            <label className="flex items-center gap-3 cursor-pointer text-gray-800 min-w-0">
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => togglePerson(p.id)}
                className="shrink-0"
              />
              <span className="truncate">{p.name}</span>
            </label>


            {/* Custom Amount Input — appears dynamically with improved spacing */}
            {splitType === "custom" && selected.has(p.id) && (
              <div className="ml-4 flex items-center">
                <input
                  ref={(el) => (inputRefs.current[p.id] = el)}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customAmounts[p.id] ?? ""}
                  onChange={(e) =>
                    setCustomAmounts((prev) => ({ ...prev, [p.id]: e.target.value }))
                  }
                  className="w-20 border-2 border-gray-200 rounded-md px-3 py-2 text-sm text-right placeholder-gray-400 focus:border-indigo-500 outline-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>


      {/* Error */}
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}


      {/* Add */}
      <button
        onClick={handleAdd}
        className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-md transition-colors"
      >
        Add Expense
      </button>
    </div>
  );
};


export default ExpenseForm;
