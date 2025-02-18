import React, { useState, useEffect } from 'react';
import { checkAndCreateUserStats } from '../services/RecruitmentServices';
import { Loader } from '../utils';

const UserStats = () => {
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        let isMounted = true; // Zapobiega ustawianiu stanu po odmontowaniu komponentu
    
        const fetchUserStats = async () => {
            if (!isMounted) return;
            setLoading(true);
            const stats = await checkAndCreateUserStats();
            if (isMounted) setUserStats(stats);
            setLoading(false);
        };
    
        fetchUserStats();
    
        return () => {
            isMounted = false; // Cleanup, jeśli komponent zostanie odmontowany
        };
    }, []);

    if (loading) return <Loader />;
    if (!userStats) return <div>No user stats found</div>;

    return (
        <div className="p-4 md:p-6 h-screen-80 overflow-auto ">
            <div className="md:mt-12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4  ">

                {/* All Time Recruitments Count */}
                <div className="p-4 bg-gradient-to-r from-green-600 to-yellow-600 rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105">
                    <span className="text-2xl">👥</span>
                    <div>
                        <h2 className="text-lg font-bold">All Time Recruitments</h2>
                        <p className="text-xl">{userStats.AllTimeRecruitmentsCount}</p>
                    </div>
                </div>
                 {/* Hired Applicants */}
                <div className="p-4 bg-gradient-to-r from-gray-600 to-black rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105">
                    <span className="text-2xl">🏆</span>
                    <div>
                        <h2 className="text-lg font-bold">Hired Applicants</h2>
                        <p className="text-xl">{userStats.AllTimeHiredApplicants}</p>
                    </div>
                </div>

                {/* All Time Meetings Count */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105">
                    <span className="text-2xl">📅</span>
                    <div>
                        <h2 className="text-lg font-bold">All Time Meetings</h2>
                        <p className="text-xl">{userStats.AllTimeMeetingsCount}</p>
                    </div>
                </div>
                {/* All Time Applications Count */}
                <div className="p-4 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105">
                    <span className="text-2xl">📄</span>
                    <div>
                        <h2 className="text-lg font-bold">All Time Applications</h2>
                        <p className="text-xl">{userStats.AllTimeApplicationsCount}</p>
                    </div>
                </div>

                {/* Applications Rejected */}
                <div className="p-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105">
                    <span className="text-2xl">❌</span>
                    <div>
                        <h2 className="text-lg font-bold">Applications Rejected</h2>
                        <p className="text-xl">{userStats.AllTimeApplicationRejected}</p>
                    </div>
                </div>

                {/* Applications Hired */}
                <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105">
                    <span className="text-2xl">✅</span>
                    <div>
                        <h2 className="text-lg font-bold">Applications Hired</h2>
                        <p className="text-xl">{userStats.AllTimeApplicationHired}</p>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default UserStats;