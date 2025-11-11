import React from "react";
import { Person, Balance, Settlement } from "../types";


interface Props {
  people: Person[];
  balances: Balance[];
  settlements: Settlement[];
}


const BalanceView: React.FC<Props> = ({ balances, settlements }) => {
  const total = balances.reduce((sum, b) => sum + b.paid, 0);


  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      {/* Section Header */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">💰 Balances</h2>


      {/* Total Group Spending */}
      <div className="flex justify-between items-center px-4 py-3 rounded-lg mb-5 text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 shadow-inner">
        <span>Total Group Spending:</span>
        <span className="text-lg">${total.toFixed(2)}</span>
      </div>


      {/* Individual Balances */}
      <div className="space-y-2 mb-6">
        <h3 className="text-gray-700 font-medium text-base mb-1">Individual Balances</h3>
        {balances.map((b) => (
          <div
            key={b.personId}
            className={`flex justify-between items-center px-3 py-2 rounded-md border font-medium transition-all
              ${
                b.balance > 0.01
                  ? "bg-green-50 border-green-300 text-green-800"
                  : b.balance < -0.01
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
          >
            <span>{b.personName}</span>
            <span className="flex items-center gap-1">
              {b.balance > 0.01 && (
                <>
                  <span className="text-gray-600">is owed</span>
                  <span className="font-semibold text-green-600">
                    +${b.balance.toFixed(2)}
                  </span>
                </>
              )}
              {b.balance < -0.01 && (
                <>
                  <span className="text-gray-600">owes</span>
                  <span className="font-semibold text-red-600">
                    -${Math.abs(b.balance).toFixed(2)}
                  </span>
                </>
              )}
              {Math.abs(b.balance) <= 0.01 && (
                <span className="text-gray-600 italic">settled up</span>
              )}
            </span>
          </div>
        ))}
      </div>


      {/* Suggested Settlements */}
      {settlements.length > 0 && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            🤝 Suggested Settlements
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Minimum transactions to settle all debts:
          </p>


          <div className="space-y-2">
            {settlements.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 rounded-md bg-white border border-gray-100 shadow-sm"
              >
                <div className="text-sm">
                  <span className="text-red-600 font-medium">{s.from}</span>
                  <span className="text-gray-500 mx-1">→</span>
                  <span className="text-green-600 font-medium">{s.to}</span>
                </div>
                <strong className="text-gray-800">${s.amount.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default BalanceView;
