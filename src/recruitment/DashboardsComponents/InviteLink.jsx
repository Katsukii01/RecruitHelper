import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const InviteLink = ({ id }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/RecruitmentAddApplicants?recruitmentId=${id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset po 2 sek
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg text-center"
    >
      <h2 className="text-xl font-semibold">
        {t("Invite Link.Share invite")}
      </h2>
      <p className="text-gray-400 mt-2">
        {t("Invite Link.Send this link")}:
        </p>

      <div className="relative mt-4 flex items-center">
        <input
          type="text"
          value={inviteUrl}
          readOnly
          className="w-full p-3 pr-12 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={copyToClipboard}
          className="absolute right-3 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
        </motion.button>
      </div>

      {copied && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-green-400 text-sm"
        >
          Link skopiowany do schowka!
        </motion.p>
      )}
    </motion.div>
  );
};

export default InviteLink;
