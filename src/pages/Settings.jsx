import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaSave } from 'react-icons/fa';

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('User details updated:', userDetails);
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-lg rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            <FaUser className="inline-block mr-2" /> Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            <FaEnvelope className="inline-block mr-2" /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            <FaLock className="inline-block mr-2" /> Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            <FaPhone className="inline-block mr-2" /> Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={userDetails.phone}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700">
          <FaSave className="inline-block mr-2" /> Save
        </button>
      </form>
    </div>
  );
};

export default Settings;