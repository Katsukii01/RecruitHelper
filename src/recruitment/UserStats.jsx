import React, { useState, useEffect } from 'react';
import { checkAndCreateUserStats } from '../services/RecruitmentServices';
import { Loader } from '../utils';
import { BiUserCheck, BiBriefcase, BiCalendarCheck, BiFile, BiXCircle, BiCheckCircle } from "react-icons/bi";
import { useTranslation } from 'react-i18next';

const UserStats = () => {
    const { t } = useTranslation();
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
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                {[
                    { label: t("UserStats.Total Recruitments"), icon: <BiBriefcase className=" text-gray-500" />, value: userStats.AllTimeRecruitmentsCount }, // Rekrutacje -> Walizka
                    { label: t("UserStats.Total Hired Applicants"), icon: <BiUserCheck className=" text-green-500" />, value: userStats.AllTimeHiredApplicants }, // Zatrudnieni -> Użytkownik z checkiem
                    { label: t("UserStats.Total Meetings"), icon: <BiCalendarCheck className=" text-blue-500" />, value: userStats.AllTimeMeetingsCount }, // Spotkania -> Kalendarz z checkiem
                    { label: t("UserStats.Total Applications"), icon: <BiFile className=" text-gray-500" />, value: userStats.AllTimeApplicationsCount }, // Aplikacje -> Plik/dokument
                    { label: t("UserStats.Total Applications Rejected"), icon: <BiXCircle className=" text-red-500" />, value: userStats.AllTimeApplicationRejected }, // Odrzucone -> Ikona X
                    { label: t("UserStats.Total Applications Hired"), icon: <BiCheckCircle className=" text-green-500" />, value: userStats.AllTimeApplicationHired }, // Przyjęte -> Check circle
                ].map((item, index) => (
                <div
                    key={index}
                    className="p-10 bg-glass-dark rounded-2xl shadow-xl shadow-black text-white flex items-center gap-8 hover:scale-[1.07] transition-all duration-300 relative group"
                >
                    {/* Dynamiczne światło na hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity rounded-2xl" />

                    {/* Ikona - powiększona */}
                    <span className="text-4xl md:text-5xl text-primary">{item.icon}</span>

                    {/* Opis i wartość - lepsze formatowanie */}
                    <div className="flex flex-col">
                    <h2 className="text-lg md:text-xl font-extrabold tracking-wide">{item.label}</h2>
                    <p className="text-4xl md:text-5xl font-extrabold text-primary">{item.value}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>

    );
};

export default UserStats;