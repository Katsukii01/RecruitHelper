import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaEnvelope, FaEdit, FaTrash } from 'react-icons/fa';

const HomePage = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg mb-10">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaUser className="text-cyan-400 text-4xl" /> Help: Managing Your Account
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70 ">

        {/* 🔹 Default Profile Picture */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUser className="text-cyan-400 text-2xl" /> Profile Picture
          </h2>
          <p className="text-gray-300 mt-2">
            - Your profile has a default picture. <br />
            - You can change it in your account settings.
          </p>
        </div>

        {/* 🔹 Email Verification */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEnvelope className="text-cyan-400 text-2xl" /> Email Verification
          </h2>
          <p className="text-gray-300 mt-2">
            - Your email must be verified to access all features. <br />
            - If not verified, check your inbox for a verification link.
          </p>
        </div>

        {/* 🔹 Update Name */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEdit className="text-cyan-400 text-2xl" /> Update Name
          </h2>
          <p className="text-gray-300 mt-2">
            - You can update your name anytime. <br />
            - Enter your new name and save changes.
          </p>
        </div>

        {/* 🔹 Delete Account */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-400 flex items-center gap-3">
            <FaTrash className="text-red-400 text-2xl" /> Delete Account
          </h2>
          <p className="text-gray-300 mt-2">
            - Deleting your account is permanent. <br />
            - All your recruitment data will be lost. <br />
            - To confirm, enter your username and proceed.
          </p>
        </div>

        {/* 🔹 Password Update */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEdit className="text-cyan-400 text-2xl" /> Update Password
          </h2>
          <p className="text-gray-300 mt-2">
            - If you signed up with Google, update your password through Google settings. <br />
            - Otherwise, you can change your password in account settings.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(HomePage, 'HomePage');
