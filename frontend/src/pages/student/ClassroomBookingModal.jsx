import React, { useState } from "react";
import { FaKey, FaTimes, FaClock, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { TimePicker } from "./TimePicker"; // You'll need to create this component

const ClassroomBookingModal = ({
  selectedRoom,
  handleBookNow,
  handleCancel,
}) => {
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    startTime: "14:00",
    endTime: "17:00",
    purpose: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-95"></div>
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">Book Classroom</h2>
                  <p className="text-blue-100 mt-1">
                    {selectedRoom.building}, {selectedRoom.floor}
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-blue-200 transition-colors p-1 rounded-full"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              <div className="mt-4 bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-white font-medium text-lg">
                  Room {selectedRoom.room}
                </p>
                <div className="flex items-center mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  <span className="text-blue-100 text-sm">Available now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Date Picker */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Booking Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  Start Time
                </label>
                <TimePicker 
                  value={bookingData.startTime}
                  onChange={(time) => setBookingData({...bookingData, startTime: time})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  End Time
                </label>
                <TimePicker 
                  value={bookingData.endTime}
                  onChange={(time) => setBookingData({...bookingData, endTime: time})}
                  minTime={bookingData.startTime}
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose (Optional)
              </label>
              <textarea
                name="purpose"
                value={bookingData.purpose}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="E.g. Group study, Project meeting..."
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBookNow(bookingData)}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md flex items-center"
              >
                <FaKey className="mr-2" />
                Confirm Booking
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClassroomBookingModal;