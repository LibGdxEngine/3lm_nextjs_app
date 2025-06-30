'use client'
import React, { useState, useCallback } from 'react';
import { Upload, Plus, Trash2, FileText, Eye, Download, Search, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadStep, FieldStep, ReviewStep, simulateExtraction, Header, ProgressSteps } from './utils';

const Page = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [extractionFields, setExtractionFields] = useState([
    { id: 1, name: 'Name', value: '', arabic: 'الاسم' },
    { id: 2, name: 'Age', value: '', arabic: 'العمر' }
  ]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Define Fields, 3: Review
  const [isProcessing, setIsProcessing] = useState(false);

  // Add new extraction field
  const addField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      value: '',
      arabic: ''
    };
    setExtractionFields([...extractionFields, newField]);
  };

  // Remove extraction field
  const removeField = (id) => {
    if (extractionFields.length > 1) {
      setExtractionFields(extractionFields.filter(field => field.id !== id));
    }
  };

  // Update field name
  const updateFieldName = (id, name, arabic = '') => {
    setExtractionFields(extractionFields.map(field => 
      field.id === id ? { ...field, name, arabic } : field
    ));
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setExtractedText(text);
        // Do NOT extract here, just go to next step
          setIsProcessing(false);
          setCurrentStep(2);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing file:', error);
      setIsProcessing(false);
    }
  }, []);

  // Process extraction
  const processExtraction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Only extract when user clicks
      const updatedFields = simulateExtraction(extractedText, extractionFields);
      setExtractionFields(updatedFields);
      setIsProcessing(false);
      setCurrentStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100" dir="rtl">
      {/* Header */}
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />

        {/* Step 1: File Upload */}
        <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <UploadStep
            key="step1"
            isProcessing={isProcessing}
            uploadedFile={uploadedFile}
            handleFileUpload={handleFileUpload}
          />
        )}
        </AnimatePresence>

        {/* Step 2: Define Extraction Fields */}
        <AnimatePresence mode="wait">
        {currentStep === 2 && (
          <FieldStep
            key="step2"
            extractionFields={extractionFields}
            updateFieldName={updateFieldName}
            removeField={removeField}
            addField={addField}
            isProcessing={isProcessing}
            processExtraction={processExtraction}
          />
        )}
        </AnimatePresence>

        {/* Step 3: Review Results */}
        <AnimatePresence mode="wait">
        {currentStep === 3 && (
          <ReviewStep
            key="step3"
            extractionFields={extractionFields}
            setCurrentStep={setCurrentStep}
            setUploadedFile={setUploadedFile}
            setExtractedText={setExtractedText}
            setExtractionFields={setExtractionFields}
            extractedText={extractedText}
          />
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;