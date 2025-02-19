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
            <div className="p-4 xl:p-6 h-screen overflow-auto inner-shadow">
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 ">
                {[
                { label: "All Time Recruitments", icon: "👥", value: userStats.AllTimeRecruitmentsCount },
                { label: "Hired Applicants", icon: "🏆", value: userStats.AllTimeHiredApplicants },
                { label: "All Time Meetings", icon: "📅", value: userStats.AllTimeMeetingsCount },
                { label: "All Time Applications", icon: "📄", value: userStats.AllTimeApplicationsCount },
                { label: "Applications Rejected", icon: "❌", value: userStats.AllTimeApplicationRejected },
                { label: "Applications Hired", icon: "✅", value: userStats.AllTimeApplicationHired },
                ].map((item, index) => (
                <div
                    key={index}
                    className="p-11 bg-glass-dark rounded-2xl shadow-2xl shadow-black text-white flex items-center gap-6 hover:scale-105 transition-all duration-300 relative group"
                >
                    {/* Dynamiczne światło na hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl" />

                    {/* Ikona */}
                    <span className="text-2xl md:text-3xl">{item.icon}</span>

                    {/* Opis i wartość */}
                    <div>
                    <h2 className="text-lg md:text-xl font-extrabold tracking-wide">{item.label}</h2>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{item.value}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>

    );
};

export default UserStats;