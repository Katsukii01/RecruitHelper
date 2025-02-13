import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteRecruitment, getRecruitmentById } from '../../services/RecruitmentServices';
import { DsectionWrapper } from '../../hoc';

const DeleteRecruitment = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [recruitmentName, setRecruitmentName] = useState('');
  const [actualRecruitmentName, setActualRecruitmentName] = useState('');
  const [isNameCorrect, setIsNameCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false); // nowy stan do obsługi customowego alertu
  const navigate = useNavigate();

  // Fetch recruitment name by ID
  useEffect(() => {
    const fetchRecruitmentName = async () => {
      try {
        const recruitment = await getRecruitmentById(id);
        setActualRecruitmentName(recruitment.name); // Zakładamy, że nazwa jest w polu `name`
      } catch (err) {
        setError(err.message || 'Failed to fetch recruitment details.');
      }
    };

    fetchRecruitmentName();
  }, [id]);

  // Countdown logic
  useEffect(() => {
    if (countdown > 0 && showCustomAlert) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setIsCountdownFinished(true); // End the countdown
    }
  }, [countdown, showCustomAlert]);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteRecruitment(id);
      setShowCustomAlert(false); // Ukryj customowy alert
      navigate('/Dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the recruitment.');
    } finally {
      setLoading(false);
      setShowModal(false);
      alert ('Recruitment deleted successfully!');
    }
  };

  const handleFinalConfirmation = () => {
    setShowCustomAlert(true); // Pokaż customowy alert
    setCountdown(5); // Restart timer po kliknięciu
  };

  const handleCancelDelete = () => {
    setShowCustomAlert(false); // Anulowanie operacji
    setCountdown(5); // Resetowanie timera
    setIsCountdownFinished(false); // Resetowanie flagi
  };

  return (
    <section className="relative w-full mx-auto p-4 bg-black border-2 border-red-700 rounded-md flex flex-col items-center justify-center mb-16">
      <h1 className="text-2xl text-white mb-4">Delete Recruitment</h1>
      {!showModal && (
      <button
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        onClick={() => setShowModal(true)}
      >
        Begin Recruitment Deletion Process
      </button>
        )}

      {/* Modal */}
      {showModal && !showCustomAlert && (
        <div className="mt-5 w-full h-full bg-black bg-opacity-70  justify-center z-50 flex flex-col items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Recruitment Name</h2>
            <p className="text-gray-600 mb-4">
              Please type the recruitment name to confirm deletion:
            </p>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter recruitment name"
              value={recruitmentName}
              onChange={(e) => {
                setRecruitmentName(e.target.value);
                setIsNameCorrect(e.target.value === actualRecruitmentName);
              }}
            />
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md transition ${
                  isNameCorrect 
                    ? 'bg-red-600 text-white hover:bg-red-800'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                onClick={handleFinalConfirmation}
                disabled={!isNameCorrect}
              >
               Proceed
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      )}

          {/* Custom Alert  */}
          {showCustomAlert && (
            <div className="bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-6 rounded-md shadow-lg w-full">
                <h2 className="text-xl font-bold text-red-600 mb-4">Are you sure?</h2>
                <p className="text-gray-600 mb-4">
                  This action will delete the recruitment and cannot be undone. Do you want to proceed?
                </p>
                <p className="text-gray-600 mb-4">You have {countdown} seconds to confirm.</p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md transition ${
                      isCountdownFinished
                        ? 'bg-red-600 text-white hover:bg-red-800'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                    onClick={handleDelete}
                    disabled={!isCountdownFinished}
                  >
                    {isCountdownFinished ? 'Confirm Delete' : `${countdown} seconds`}
                  </button>
                </div>
              </div>
            </div>
          )}
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <p className="text-xl text-white">Deleting recruitment...</p>
        </div>
      )}
    </section>
  );
};

export default DsectionWrapper(DeleteRecruitment, 'DeleteRecruitment');
