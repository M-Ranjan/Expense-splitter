import React, { useState } from "react";
import { Expense, Person } from "../types";

interface Props {
  expenses: Expense[];
  people: Person[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<Props> = ({ expenses, people, onDeleteExpense }) => {
  const [open, setOpen] = useState<string | null>(null);
  const getName = (id: string) => people.find(p => p.id === id)?.name || "Unknown";

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">🧾 Expense History</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-400 italic text-center py-6">No expenses yet</p>
      ) : (
        expenses.map(e => {
          const isOpen = open === e.id;

          return (
            <div
              key={e.id}
              className="mb-3 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Header: clickable area toggles open/close */}
              <div
                onClick={() => setOpen(isOpen ? null : e.id)}
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 rounded-t-lg select-none"
                role="button"
                aria-expanded={isOpen}
              >
                {/* Left: title and subtitle */}
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{e.description}</h4>
                  <p className="text-xs text-gray-600">
                    Paid by {getName(e.paidBy)} on {new Date(e.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Right: amount + arrow */}
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <strong className="text-gray-800">${e.amount.toFixed(2)}</strong>
                  <span
                    className={`transform transition-transform duration-200 text-gray-600 pointer-events-none`}
                    aria-hidden="true"
                  >
                    {isOpen ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-5 pt-3 pb-4 bg-white border-t rounded-b-lg shadow-inner">
                  <p className="font-medium text-sm mb-2 text-gray-700">
                    Split Details ({e.splitType})
                  </p>

                  <div className="divide-y divide-gray-100 rounded-md overflow-hidden border border-gray-100">
                    {e.splits.map((s, i) => (
                      <div
                        key={s.personId}
                        className={`flex justify-between items-center py-2 px-3 text-sm ${
                          i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                        }`}
                      >
                        <span className="font-medium text-gray-800">{getName(s.personId)}</span>
                        <span className="text-red-600 font-semibold">
                          owes ${s.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delete button aligned bottom-right */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => onDeleteExpense(e.id)}
                      className="flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-md shadow hover:bg-red-700 transition-all"
                    >
                      <span>🗑️ Delete Expense</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      <p className="text-center text-gray-600 mt-3">
        Total Expenses: <strong>{expenses.length}</strong>
      </p>
    </div>
  );
};

export default ExpenseList;