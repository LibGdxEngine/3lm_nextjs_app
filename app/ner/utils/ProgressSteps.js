import React from 'react';
import { motion } from 'framer-motion';

const ProgressSteps = ({ currentStep, setCurrentStep }) => (
  <div className="flex justify-center mb-12">
    <div className="flex items-center space-x-4 space-x-reverse">
      {[1, 2, 3].map((step) => {
        const isClickable = step <= currentStep;
        return (
          <React.Fragment key={step}>
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-green-600 border-green-600 text-white scale-110' 
                  : 'border-gray-300 text-gray-400'
              } ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed'}`}
              onClick={() => {
                if (isClickable) setCurrentStep(step);
              }}
              title={isClickable ? 'انتقل إلى هذه الخطوة' : 'لا يمكن الانتقال لهذه الخطوة بعد'}
              style={{ userSelect: 'none' }}
            >
              {step}
            </motion.div>
            {step < 3 && (
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`w-16 h-1 transition-all duration-300 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

export default ProgressSteps; 