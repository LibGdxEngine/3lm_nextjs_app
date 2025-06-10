import React from "react";
import { Upload } from "lucide-react";

export default function FileUpload({
  onFileSelect,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  fileInputRef,
  handleUploadClick,
  file,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={onFileSelect}
          className="hidden"
        />
        <div className="space-y-4">
          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              اسحب وأفلت ملف PDF هنا
            </h3>
            <p className="text-gray-500 mb-4">أو اضغط لاختيار ملف من جهازك</p>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors"
            >
              <Upload className="w-5 h-5 ml-2" />
              اختيار ملف
            </button>
          </div>
          {file && (
            <div className="text-sm text-gray-600 mt-2">
              الملف المحدد: {file.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
