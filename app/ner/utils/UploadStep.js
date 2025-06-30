import React from 'react';
import { Upload, FileText } from 'lucide-react';

const UploadStep = ({ isProcessing, uploadedFile, handleFileUpload }) => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <div className="text-center mb-8">
      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Upload className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">رفع الملف</h2>
      <p className="text-gray-600 text-lg">اختر ملف نصي أو PDF لاستخراج البيانات منه</p>
    </div>
    <div 
      className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-400 transition-colors cursor-pointer"
      onClick={() => document.getElementById('file-input').click()}
    >
      {isProcessing ? (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">جاري معالجة الملف...</p>
        </div>
      ) : uploadedFile ? (
        <div className="space-y-4">
          <FileText className="h-16 w-16 text-green-600 mx-auto" />
          <p className="text-lg font-medium text-gray-900">{uploadedFile.name}</p>
          <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Upload className="h-16 w-16 text-gray-400 mx-auto" />
          <p className="text-xl text-gray-600">اسحب الملف هنا أو انقر للاختيار</p>
          <p className="text-sm text-gray-400">PDF, TXT, DOCX</p>
        </div>
      )}
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept=".txt,.pdf,.docx"
        onChange={handleFileUpload}
      />
    </div>
  </div>
);

export default UploadStep; 