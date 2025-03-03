import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

const HelpGuideLink = ({ section }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex justify-end w-full">
      <a
        href={`/help#${section}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-400 text-gray-400 
        hover:bg-gray-800 hover:text-white transition-all duration-300 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FaQuestionCircle className="size-6" />
      </a>

      {isHovered && (
        <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-md whitespace-nowrap">
          Open guide
        </div>
      )}
    </div>
  );
};

export default HelpGuideLink;
