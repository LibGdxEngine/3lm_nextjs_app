import React from "react";
import { CheckCircle } from "lucide-react";
import ImageDisplay from "./ImageDisplay";
import TextDisplay from "./TextDisplay";
import PageNavigation from "./PageNavigation";

export default function ResultsSection({ imageUrl, ocrText, isLoadingPage, currentPage,
    totalPages, setOcrText, bookId, handlePageChange, handleSaveText }) {
        
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 ml-3" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      نتائج المعالجة
                    </h3>
                  </div>
    
                  <PageNavigation
                    totalPages={totalPages}
                    currentPage={currentPage}
                    isLoadingPage={isLoadingPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
    
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <ImageDisplay
                      imageUrl={imageUrl}
                      isLoadingPage={isLoadingPage}
                      currentPage={currentPage}
                      totalPages={totalPages}
                    />
                    <div className="flex justify-start gap-2 mt-2">
                      <button
                        onClick={handleSaveText}
                        disabled={!bookId || !currentPage}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        حفظ النص
                      </button>
                    </div>
                    {totalPages > 3 && (
                      <div className="flex items-center justify-center space-x-reverse space-x-2 pt-2">
                        <span className="text-sm text-gray-600 ml-2">
                          الانتقال السريع:
                        </span>
                        {[1, Math.floor(totalPages / 2), totalPages].map(
                          (pageNum, index) => (
                            <button
                              key={index}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={pageNum === currentPage || isLoadingPage}
                              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                pageNum === currentPage
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              } disabled:opacity-50`}
                            >
                              {pageNum}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <TextDisplay
                    ocrText={ocrText}
                    isLoadingPage={isLoadingPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setOcrText={setOcrText}
                    bookId={bookId}
                  />
                </div>
              </div>
  );
}
