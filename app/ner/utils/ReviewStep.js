import React from 'react';
import { Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewStep = ({ extractionFields, setCurrentStep, setUploadedFile, setExtractedText, setExtractionFields, extractedText }) => (
  <div className="space-y-8">
    <motion.div layout className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="h-10 w-10 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">مراجعة النتائج</h2>
        <p className="text-gray-600 text-lg">راجع البيانات المستخرجة وتأكد من صحتها</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatePresence>
          {extractionFields.map((field) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 text-lg">{field.arabic || field.name}</h3>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">{field.name}</span>
              </div>
              <div className="bg-white p-4 rounded border">
                <p className="text-gray-800 font-medium">{field.value}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-center space-x-4 space-x-reverse">
        <button
          onClick={() => setCurrentStep(2)}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
        >
          تعديل الحقول
        </button>
        <button
          onClick={() => {
            // Simulate download
            const data = extractionFields.reduce((acc, field) => {
              acc[field.name] = field.value;
              return acc;
            }, {});
            console.log('Downloaded data:', data);
            alert('تم تنزيل البيانات بنجاح!');
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 space-x-reverse"
        >
          <Download className="h-5 w-5" />
          <span>تنزيل النتائج</span>
        </button>
        <button
          onClick={() => {
            setCurrentStep(1);
            setUploadedFile(null);
            setExtractedText('');
            setExtractionFields([
              { id: 1, name: 'Name', value: '', arabic: 'الاسم' },
              { id: 2, name: 'Age', value: '', arabic: 'العمر' }
            ]);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          ملف جديد
        </button>
      </div>
    </motion.div>
    {extractedText && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">معاينة النص المصدر</h3>
        <div className="bg-gray-50 p-6 rounded-lg max-h-64 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap text-right">
            {extractedText.substring(0, 1000)}
            {extractedText.length > 1000 && '...'}
          </pre>
        </div>
      </motion.div>
    )}
  </div>
);

export default ReviewStep; 