import React from 'react';
import { DsectionWrapper } from '../../hoc';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const SignUpHelp = () => {
  return (
    <section className="relative w-full min-h-screen-80 mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-3">
        <FaInfoCircle className="text-cyan-400 text-4xl" /> Help: Signing Up
      </h1>

      <div className="p-6 space-y-6 rounded-lg overflow-auto h-screen-70 ">

        {/* 🔹 Username */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaUser className="text-cyan-400 text-2xl" /> Username
          </h2>
          <p className="text-gray-300 mt-2">
            - Choose a unique username. <br />
            - Max length: 25 characters.
          </p>
        </div>

        {/* 🔹 Email */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaEnvelope className="text-cyan-400 text-2xl" /> Email
          </h2>
          <p className="text-gray-300 mt-2">
            - Enter a valid email address. <br />
            - You need to confirm your email by re-entering it.
          </p>
        </div>

        {/* 🔹 Password */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaLock className="text-cyan-400 text-2xl" /> Password
          </h2>
          <p className="text-gray-300 mt-2">
            - Must be at least 8 characters long. <br />
            - Use uppercase, lowercase, numbers, and symbols. <br />
            - Confirm your password to avoid mistakes.
          </p>
        </div>

        {/* 🔹 Terms & Conditions */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaCheckCircle className="text-cyan-400 text-2xl" /> Terms & Conditions
          </h2>
          <p className="text-gray-300 mt-2">
            - You must accept the terms and conditions to proceed.
          </p>
        </div>

        {/* 🔹 Sign up with Google */}
        <div className="bg-gray-800/90 p-5 rounded-lg shadow-md border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-200 flex items-center gap-3">
            <FaGoogle className="text-red-400 text-2xl" /> Sign up with Google
          </h2>
          <p className="text-gray-300 mt-2">
            - Click on the <strong>Google Sign-Up</strong> button. <br />
            - Authenticate using your Google account.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DsectionWrapper(SignUpHelp, 'SignUp');
