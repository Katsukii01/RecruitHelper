import React, { useEffect, useState } from 'react';
import { DsectionWrapper } from '../../hoc';
import { getApplicantsRanking, getRecruitmentById } from '../../firebase/RecruitmentServices';
import { Loader } from '../../components';

const ApplicantsOfferRanking = ({ id }) => {
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rankedApplicants, setRankedApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can change the number of applicants per page

  // Fetch recruitment name by ID
  useEffect(() => {
    const fetchRecruitmentName = async () => {
      try {
        const recruitment = await getRecruitmentById(id);
        setRecruitment(recruitment) 
      } catch (err) {
        setError(err.message || 'Failed to fetch recruitment details.');
      }
    };

    fetchRecruitmentName();
  }, [id]);

  useEffect(() => {
    const fetchApplicantsRanking = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getApplicantsRanking(id);
          setRankedApplicants(data);
        } catch (error) {
          console.error('Error fetching applicants ranking:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplicantsRanking();
  }, [id]);

  const paginate = (applicants, pageNumber, itemsPerPage) => {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return applicants.slice(startIndex, endIndex);
  };

  if(!recruitment) return  <section className="relative w-full h-screen mx-auto p-4 bg-glass card">No recruitment found</section>;
  if (loading) return <section className="relative w-full h-screen mx-auto p-4 bg-glass card"><Loader /></section>;


  const currentApplicants = paginate(rankedApplicants, currentPage, itemsPerPage);

  const getProgressBarColor = (score) => {
    if (score < 40) return 'bg-red-500'; // Red
    if (score < 70) return 'bg-yellow-500'; // Yellow
    return 'bg-green-500'; // Green
  };

  return (
    <section className="relative w-full h-screen mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Applicants Offer Ranking</h1>
      
      {currentApplicants.length > 0 ? (
        <div>
          {currentApplicants.map((applicant, index) => (
            <div key={applicant.id} className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
              <h2 className="font-bold text-lg">{`${applicant.name} ${applicant.surname} `}</h2>
              <div className="mb-2">
                <p className="text-sm">Overall Score: {applicant.score}%</p>
                <div className="w-full h-2 bg-gray-300 rounded-full">
                  <div
                    className={`h-full ${getProgressBarColor(applicant.score)}`}
                    style={{ width: `${applicant.score}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Courses: {applicant.scores.courses }%</p>
                <div className="w-full h-2 bg-gray-300 rounded-full">
                  <div
                    className={`h-full ${getProgressBarColor(applicant.scores.courses)}`}
                    style={{ width: `${applicant.scores.courses}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Skills: {applicant.scores.skills}%</p>
                <div className="w-full h-2 bg-gray-300 rounded-full">
                  <div
                    className={`h-full ${getProgressBarColor(applicant.scores.skills)}`}
                    style={{ width: `${applicant.scores.skills}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Languages: {applicant.scores.languages}%</p>
                <div className="w-full h-2 bg-gray-300 rounded-full">
                  <div
                    className={`h-full ${getProgressBarColor(applicant.scores.languages)}`}
                    style={{ width: `${applicant.scores.languages}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Experience: {applicant.scores.experience}%</p>
                <div className="w-full h-2 bg-gray-300 rounded-full">
                  <div
                    className={`h-full ${getProgressBarColor(applicant.scores.experience)}`}
                    style={{ width: `${applicant.scores.experience}%` }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">Education: {applicant.scores.education}%</p>
                <div className="w-full h-2 bg-gray-300 rounded-full">
                  <div
                    className={`h-full ${getProgressBarColor(applicant.scores.education)}`}
                    style={{ width: `${applicant.scores.education}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button
              className="btn-prev"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn-next"
              onClick={() => setCurrentPage(Math.min(Math.ceil(rankedApplicants.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(rankedApplicants.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No applicants found.</p>
      )}
    </section>
  );
};

export default DsectionWrapper(ApplicantsOfferRanking, 'ApplicantsOfferRanking');
