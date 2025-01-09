import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      {/* First Page Button */}
      <button
        onClick={() => handlePageChange(1)}
        className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        &#x21E6; {/* Leftwards Double Arrow */}
      </button>

      {/* Previous Page Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        &#x2190; {/* Leftwards Arrow */}
      </button>

      {/* Current Page Number */}
      <span className="text-white text-lg">
        {currentPage} of {totalPages}
      </span>

      {/* Next Page Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        &#x2192; {/* Rightwards Arrow */}
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => handlePageChange(totalPages)}
        className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        &#x21E8; {/* Rightwards Double Arrow */}
      </button>
    </div>
  );
};

export default Pagination;
