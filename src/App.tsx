import React, { useState } from "react";
import { Person, Expense } from "./types";
import { calculateBalances, calculateSettlements } from "./utils/calculations";
import PeopleManager from "./components/PeopleManager";
import ExpenseForm from "./components/ExpenseForm";
import BalanceView from "./components/BalanceView";
import ExpenseList from "./components/ExpenseList";


/**
 * Initial demo data to show the UI filled (you can remove/modify)
 */
const initialPeople: Person[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
  { id: "4", name: "Diana" },


];


const initialExpenses: Expense[] = [
  {
    id: "e1",
    description: "Lunch at restaurant",
    amount: 120,
    paidBy: "1", // Alice
    date: "2024-01-28",
    splitType: "equal",
    splits: [
      { personId: "1", amount: 30 },
      { personId: "2", amount: 30 },
      { personId: "3", amount: 30 },
      { personId: "4", amount: 30 },
    ],
  },
  {
    id: "e2",
    description: "Uber to airport",
    amount: 45,
    paidBy: "2", // Bob
    date: "2024-01-27",
    splitType: "equal",
    splits: [
      { personId: "1", amount: 22.5 },
      { personId: "2", amount: 22.5 },
    ],
  },
  {
    id: "e3",
    description: "Concert tickets",
    amount: 200,
    paidBy: "3", // Charlie
    date: "2024-01-26",
    splitType: "equal",
    splits: [
      { personId: "1", amount: 50 },
      { personId: "2", amount: 50 },
      { personId: "3", amount: 50 },
      { personId: "4", amount: 50 },
    ],
  },
 
];


const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);


  const addPerson = (name: string) => {
    setPeople(prev => [...prev, { id: Date.now().toString(), name }]);
  };


  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    // remove expenses that reference removed person as payer or as split participant
    setExpenses(prev => prev.filter(e => e.paidBy !== id && !e.splits.some(s => s.personId === id)));
  };


  const addExpense = (exp: Omit<Expense, "id">) => {
    setExpenses(prev => [{ ...exp, id: Date.now().toString() }, ...prev]);
  };


  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };


  const balances = calculateBalances(people, expenses);
  const settlements = calculateSettlements(balances);


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md p-6 text-center border-b border-white/20">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
      </header>


      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: People + Add Expense */}
        <div className="space-y-6">
          <PeopleManager people={people} onAddPerson={addPerson} onRemovePerson={removePerson} />
          <ExpenseForm people={people} onAddExpense={addExpense} />
        </div>


        {/* RIGHT: Balances + Expense History */}
        <div className="space-y-6">
          <BalanceView people={people} balances={balances} settlements={settlements} />
          <ExpenseList expenses={expenses} people={people} onDeleteExpense={deleteExpense} />
        </div>
      </main>
    </div>
  );
};


export default App;
