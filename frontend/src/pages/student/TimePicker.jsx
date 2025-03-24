import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export const TimePicker = ({ value, onChange, minTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate time options
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      if (!minTime || timeString >= minTime) {
        times.push(timeString);
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-xl text-left flex justify-between items-center hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {value}
        <FaChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => {
                onChange(time);
                setIsOpen(false);
              }}
              className={`w-full p-3 text-left hover:bg-blue-50 ${value === time ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};