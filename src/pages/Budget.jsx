import React, { useState, useEffect } from 'react';

const Budget = () => {
  const [categories, setCategories] = useState(['Food', 'Investment']);
  const [subcategories, setSubcategories] = useState(['Weekly', 'Crypto']);
  const [budget, setBudget] = useState(1000);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (totalExpenses > budget) {
      setNotification('Budget exceeded!');
    } else {
      setNotification('');
    }
  }, [totalExpenses, budget]);

  const addCategory = (e) => {
    e.preventDefault();
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };

  const addSubcategory = (e) => {
    e.preventDefault();
    setSubcategories([...subcategories, newSubcategory]);
    setNewSubcategory('');
  };

  const handleBudgetChange = (e) => {
    setBudget(parseFloat(e.target.value));
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Budget</h2>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Set Budget</h3>
        <input
          type="number"
          value={budget}
          onChange={handleBudgetChange}
          className="p-2 border rounded mr-2"
        />
        <p className="text-2xl font-bold text-blue-600">Current Budget: ${budget}</p>
      </div>
      {notification && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
          {notification}
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Add Category</h3>
        <form onSubmit={addCategory}>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-700">
            Add Category
          </button>
        </form>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Add Subcategory</h3>
        <form onSubmit={addSubcategory}>
          <input
            type="text"
            placeholder="Subcategory Name"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button type="submit" className="bg-purple-500 text-white p-2 rounded-lg shadow hover:bg-purple-700">
            Add Subcategory
          </button>
        </form>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Categories</h3>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-left">{category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Subcategories</h3>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Subcategory</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-left">{subcategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Budget;