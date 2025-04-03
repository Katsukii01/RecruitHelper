import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaPlusCircle, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RecruitmentAdnationalPoints = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> {t('help.recruitmentAdnationalPoints.title')}
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70">
        {/* Explanation */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-yellow-200 flex items-center gap-3">
            <FaPlusCircle className="text-yellow-400 text-2xl" /> {t('help.recruitmentAdnationalPoints.assigning')}
          </h2>
          <p className="text-gray-300 mt-2 whitespace-pre-line">
            {t('help.recruitmentAdnationalPoints.assigning_desc')}
          </p>
        </div>

        {/* Example Table */}
        <div className="bg-gray-900/90 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            <FaUser className="text-blue-400 text-2xl" /> {t('help.recruitmentAdnationalPoints.example')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-gray-300 border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 p-3">{t('help.recruitmentAdnationalPoints.applicant')}</th>
                  <th className="border border-gray-600 p-3">{t('help.recruitmentAdnationalPoints.additionalPoints')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-700">
                  <td className="border border-gray-600 p-3">Jan Kowalski <br /> jan.kowalski@gmail.com</td>
                  <td className="border border-gray-600 p-3">0</td>
                </tr>
                <tr className="bg-gray-700">
                  <td className="border border-gray-600 p-3">Adam Adacki <br /> adam.adacki@gmail.com</td>
                  <td className="border border-gray-600 p-3">{t('help.recruitmentAdnationalPoints.editable')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(RecruitmentAdnationalPoints, 'RecruitmentAdnationalPoints');
