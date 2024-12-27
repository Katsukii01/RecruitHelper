import React, { useEffect, useState } from 'react';
import { getRecruitmentById } from '../../firebase/RecruitmentServices';
import { DsectionWrapper } from '../../hoc';

const ApplicantsOfferRanking = ({ id }) => {
  const [recruitment, setRecruitment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruitment = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getRecruitmentById(id);
          setRecruitment(data);
        } catch (error) {
          console.error('Error fetching recruitment:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecruitment();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!recruitment) return <div>No recruitment found</div>;

  return (
    <section className="relative w-full h-screen mx-auto p-4 bg-gradient-to-br from-blue-900 to-slate-800 rounded-md">
      <h1>Applicants Offer Ranking</h1>
      
    </section>
  );
};

export default DsectionWrapper(ApplicantsOfferRanking, 'ApplicantsOfferRanking');
