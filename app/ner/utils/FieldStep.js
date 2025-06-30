import React from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FieldStep = ({ extractionFields, updateFieldName, removeField, addField, isProcessing, processExtraction }) => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <div className="text-center mb-8">
      <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">تحديد حقول الاستخراج</h2>
      <p className="text-gray-600 text-lg">حدد البيانات التي تريد استخراجها من النص</p>
    </div>
    <div className="space-y-6">
      <AnimatePresence>
        {extractionFields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <input
                type="text"
                placeholder="اسم الحقل (مثال: الاسم)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                value={field.name}
                onChange={(e) => updateFieldName(field.id, e.target.value)}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="الترجمة العربية (اختياري)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                value={field.arabic}
                onChange={(e) => updateFieldName(field.id, field.name, e.target.value)}
              />
            </div>
            <button
              onClick={() => removeField(field.id)}
              className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              disabled={extractionFields.length === 1}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <button
        onClick={addField}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
      >
        <Plus className="h-5 w-5" />
        <span>إضافة حقل جديد</span>
      </button>
    </div>
    <div className="flex justify-center mt-8">
      <button
        onClick={processExtraction}
        disabled={isProcessing || !extractionFields.some(f => f.name.trim())}
        className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>جاري المعالجة...</span>
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            <span>استخراج البيانات</span>
          </>
        )}
      </button>
    </div>
  </div>
);

export default FieldStep; 