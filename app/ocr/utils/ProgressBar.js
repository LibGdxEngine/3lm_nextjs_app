import React from "react";

export default function ProgressBar({ isProcessing, progress }) {
  if (!isProcessing) return null;
  return (
    <div className="mt-6">
      {/* <div className="flex items-center justify-between mb-2"> */}
        {/* <span className="text-sm font-medium text-gray-700">
          جاري المعالجة...
        </span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div> */}
    </div>
  );
}
