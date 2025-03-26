import { useState } from "react";
import { FaStar, FaBicycle, FaTimes } from "react-icons/fa";

const BicycleReturnModal = ({ bicycle, onReturn, onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [conditionDescription, setConditionDescription] = useState("");
  const [experienceRating, setExperienceRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onReturn({
        feedback,
        conditionDescription,
        experienceRating
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaBicycle className="mr-2 text-green-500" />
            Return Bicycle: {bicycle.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How was your cycling experience? (1-5 stars)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setExperienceRating(star)}
                  className={`text-2xl ${star <= experienceRating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe the bicycle's condition
            </label>
            <textarea
              value={conditionDescription}
              onChange={(e) => setConditionDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Any damages or issues?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Your overall experience..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !conditionDescription || experienceRating === 0}
              className={`px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium ${
                isSubmitting || !conditionDescription || experienceRating === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BicycleReturnModal;