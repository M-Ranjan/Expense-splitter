import React, { useState } from "react";
import { Person } from "../types";


interface Props {
  people: Person[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (id: string) => void;
}


const PeopleManager: React.FC<Props> = ({ people, onAddPerson, onRemovePerson }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");


  const handleAdd = () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }
    if (people.some((p) => p.name.toLowerCase() === name.trim().toLowerCase())) {
      setError("Person already exists");
      return;
    }
    onAddPerson(name.trim());
    setName("");
    setError("");
  };


  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
        👥 Manage People
      </h2>


      {/* Add Person Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter person's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:border-indigo-500 outline-none transition-colors"
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          Add Person
        </button>
      </div>


      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}


      {/* Current Members List */}
      <div>
        <h3 className="text-gray-600 font-medium mb-2">
          Current Members ({people.length})
        </h3>


        {people.length === 0 ? (
          <p className="text-gray-400 italic text-sm text-center py-4">
            No people added yet
          </p>
        ) : (
          <ul className="space-y-1">
            {people.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-md px-3 py-2 transition-colors"
              >
                <span className="text-gray-800 font-medium">{p.name}</span>
                <button
                  onClick={() => onRemovePerson(p.id)}
                  className="text-red-500 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


export default PeopleManager;


