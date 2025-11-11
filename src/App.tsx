import React, { useEffect, useState } from "react";
import { Person, Expense } from "./types";
import { calculateBalances, calculateSettlements } from "./utils/calculations";
import PeopleManager from "./components/PeopleManager";
import ExpenseForm from "./components/ExpenseForm";
import BalanceView from "./components/BalanceView";
import ExpenseList from "./components/ExpenseList";

const App: React.FC = () => {
  // ✅ Load saved data from localStorage (if any)
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem("people");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Sync data to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ✅ Add a new member
  const addPerson = (name: string) => {
    setPeople((prev) => [...prev, { id: Date.now().toString(), name }]);
  };

  // ✅ Remove a member (no longer deletes expense history)
  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    // 👇 No longer removing their expenses from history.
    // Expense data persists even if the person is deleted.
  };

  // ✅ Add new expense
  const addExpense = (exp: Omit<Expense, "id">) => {
    setExpenses((prev) => [{ ...exp, id: Date.now().toString() }, ...prev]);
  };

  // ✅ Delete expense manually (only when user does it)
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // ✅ Calculate balances and settlements dynamically
  const balances = calculateBalances(people, expenses);
  const settlements = calculateSettlements(balances);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md p-6 text-center border-b border-white/20">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">
          💰 Expense Splitter
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT SIDE: Manage People + Add Expense */}
        <div className="space-y-6">
          <PeopleManager
            people={people}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
          />
          <ExpenseForm people={people} onAddExpense={addExpense} />
        </div>

        {/* RIGHT SIDE: Balances + Expense History */}
        <div className="space-y-6">
          <BalanceView
            people={people}
            balances={balances}
            settlements={settlements}
          />
          <ExpenseList
            expenses={expenses}
            people={people}
            onDeleteExpense={deleteExpense}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
