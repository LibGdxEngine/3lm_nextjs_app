import React from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function PageNavigation({
  totalPages,
  currentPage,
  isLoadingPage,
  handlePageChange,
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center space-x-reverse space-x-4">
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoadingPage}
          className="p-2 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="flex items-center px-4 py-2 bg-white rounded-md mx-1">
          <span className="text-sm font-medium text-gray-900">
            {currentPage} من {totalPages}
          </span>
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoadingPage}
          className="p-2 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || isLoadingPage}
        className="p-2 text-gray-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="العودة للصفحة الأولى"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
