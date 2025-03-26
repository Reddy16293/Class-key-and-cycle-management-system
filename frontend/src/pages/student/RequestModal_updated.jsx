import React, { useState, useEffect } from "react";
import { FaKey, FaTimes, FaClock, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const RequestModal_updated = ({ selectedRoom, handleCancel, userId }) => {
  const [requestData, setRequestData] = useState({
    startTime: "",
    endTime: "",
    purpose: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Debug log for initial props
    console.log("Modal mounted with props:", {
      selectedRoom,
      userId
    });

    // Set default start time to current time + 30 minutes
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const defaultStartTime = now.toISOString().slice(0, 16);
    
    // Set default end time to start time + 1 hour
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + 1);
    const defaultEndTime = endTime.toISOString().slice(0, 16);

    setRequestData({
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      purpose: ""
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed - ${name}:`, value); // Debug log
    setRequestData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    console.log("Validating form data:", requestData); // Debug log
    
    const newErrors = {};
    const now = new Date();
    const startTime = new Date(requestData.startTime);
    const endTime = new Date(requestData.endTime);

    if (!requestData.startTime) {
      newErrors.startTime = "Start time is required";
    } else if (startTime < now) {
      newErrors.startTime = "Start time must be in the future";
    }

    if (!requestData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (endTime <= startTime) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!requestData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    } else if (requestData.purpose.length > 500) {
      newErrors.purpose = "Purpose must be less than 500 characters";
    }

    console.log("Validation errors:", newErrors); // Debug log
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("Submit initiated"); // Debug log
    
    if (!validateForm()) {
      console.log("Form validation failed"); // Debug log
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Debug log before API call
      console.log("Submitting request with data:", {
        userId,
        classroomKeyId: selectedRoom.keyId,
        startTime: requestData.startTime,
        endTime: requestData.endTime,
        purpose: requestData.purpose
      });

      // Create URLSearchParams for proper encoding
      const params = new URLSearchParams();
      params.append('studentId', userId);
      params.append('classroomKeyId', selectedRoom.keyId);
      params.append('startTime', requestData.startTime);
      params.append('endTime', requestData.endTime);
      params.append('purpose', requestData.purpose);

      console.log("Request params:", params.toString()); // Debug log

      const response = await axios.post(
        'http://localhost:8080/api/key-requests/request',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        }
      );

      console.log("API response:", response); // Debug log
      toast.success(response.data || "Key request submitted successfully!");
      handleCancel();
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack
      }); // Detailed error log

      let errorMessage = "Failed to submit request";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "No response from server";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log("Submit process completed"); // Debug log
    }
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-95"></div>
            <div className="relative z-10 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">Request Key Access</h2>
                  <p className="text-purple-100 mt-1">
                    {selectedRoom.building}, {selectedRoom.floor}
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-purple-200 transition-colors p-1 rounded-full"
                  disabled={isSubmitting}
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
                  <span className="text-purple-100 text-sm">Available for booking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Time Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-purple-500" />
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={requestData.startTime}
                onChange={handleChange}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm ${
                  errors.startTime ? "border-red-500" : "border-gray-300"
                }`}
                min={new Date().toISOString().slice(0, 16)}
                disabled={isSubmitting}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaInfoCircle className="mr-1" /> {errors.startTime}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-purple-500" />
                End Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={requestData.endTime}
                onChange={handleChange}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm ${
                  errors.endTime ? "border-red-500" : "border-gray-300"
                }`}
                min={requestData.startTime || new Date().toISOString().slice(0, 16)}
                disabled={isSubmitting || !requestData.startTime}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaInfoCircle className="mr-1" /> {errors.endTime}
                </p>
              )}
            </div>

            {/* Purpose */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose (Required)
              </label>
              <textarea
                name="purpose"
                value={requestData.purpose}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm ${
                  errors.purpose ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Please explain why you need access to this room..."
                required
                disabled={isSubmitting}
              />
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaInfoCircle className="mr-1" /> {errors.purpose}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1 text-right">
                {requestData.purpose.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !requestData.startTime ||
                  !requestData.endTime ||
                  !requestData.purpose ||
                  Object.keys(errors).length > 0
                }
                className={`px-5 py-3 text-white rounded-xl transition-all font-medium shadow-md flex items-center ${
                  isSubmitting ||
                  !requestData.startTime ||
                  !requestData.endTime ||
                  !requestData.purpose ||
                  Object.keys(errors).length > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaKey className="mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RequestModal_updated;