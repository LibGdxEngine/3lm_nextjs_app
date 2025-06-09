"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Image,
  Search,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

function FileUpload({
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

function ProgressBar({ isProcessing, progress }) {
  if (!isProcessing) return null;
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          جاري المعالجة...
        </span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function PageNavigation({
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

function ImageDisplay({ imageUrl, isLoadingPage, currentPage, totalPages }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 min-h-[500px] flex items-center justify-center border-2 border-gray-200 relative">
      {isLoadingPage ? (
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الصفحة...</p>
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={`PDF Preview - Page ${currentPage}`}
          className="max-w-full max-h-full rounded-lg shadow-md object-contain"
          style={{ maxHeight: "480px" }}
        />
      ) : (
        <div className="text-center text-gray-500">
          <Image className="w-16 h-16 mx-auto mb-4 opacity-30" alt="" />
          <p className="text-lg">لم يتم العثور على صورة</p>
          <p className="text-sm">تأكد من أن الملف يحتوي على محتوى مرئي</p>
        </div>
      )}
      {totalPages > 1 && !isLoadingPage && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {currentPage}/{totalPages}
        </div>
      )}
    </div>
  );
}

function TextDisplay({
  ocrText,
  isLoadingPage,
  currentPage,
  totalPages,
  setOcrText,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-green-700 ml-2" />
          <h4 className="text-lg font-semibold text-gray-900">
            النص المستخرج {totalPages > 1 ? `- الصفحة ${currentPage}` : ""}
          </h4>
        </div>
        {ocrText && !isLoadingPage && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 ml-1" />
            <span>تم الاستخراج بنجاح</span>
          </div>
        )}
      </div>
      <div className="relative">
        {isLoadingPage ? (
          <div className="w-full h-[500px] bg-gray-50 rounded-xl flex items-center justify-center border-2 border-gray-200">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">جاري استخراج النص...</p>
            </div>
          </div>
        ) : (
          <textarea
            value={ocrText}
            onChange={(e) => setOcrText(e.target.value)}
            className="w-full h-[500px] p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right transition-all"
            placeholder="النص المستخرج سيظهر هنا..."
            style={{
              fontFamily: "Arial, sans-serif",
              lineHeight: "1.8",
              fontSize: "14px",
            }}
          />
        )}
        {!isLoadingPage && (
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white px-2 rounded">
            {ocrText.length} حرف
          </div>
        )}
      </div>
      {!isLoadingPage && (
        <div className="flex justify-end space-x-reverse space-x-3 pt-4">
          <button
            onClick={() => navigator.clipboard.writeText(ocrText)}
            disabled={!ocrText}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            نسخ النص
          </button>
          <button
            onClick={() => {
              const blob = new Blob([ocrText], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `extracted-text-page-${currentPage}-${Date.now()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={!ocrText}
            className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            تحميل كملف نصي
          </button>
        </div>
      )}
    </div>
  );
}

const PDFUploadPage = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("الرجاء اختيار ملف PDF صالح");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setProgress(0);
    setImageUrl("");
    setOcrText("");

    try {
      // Simulate PDF processing (replace with actual PDF.js implementation)
      await simulatePDFProcessing(selectedFile);
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("حدث خطأ في معالجة الملف");
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      const pdfFile = droppedFiles.find(
        (file) => file.type === "application/pdf"
      );
      if (pdfFile) {
        handleFileSelect(pdfFile);
      }
    },
    [handleFileSelect]
  );

  const simulatePDFProcessing = async (file) => {
    // This is a simulation - in a real Next.js app, you'd use PDF.js and Tesseract.js
    // You might also want to handle this server-side with an API route

    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Simulate PDF with multiple pages
    setTotalPages(5); // Simulate 5 pages
    setCurrentPage(1);

    // Simulate successful processing
    setImageUrl("/api/placeholder/400/500"); // This would be your actual PDF image
    setOcrText(
      "هذا نص تجريبي مستخرج من الصفحة الأولى. سيتم استبداله بالنص الفعلي المستخرج من PDF باستخدام تقنية OCR.\n\nThis is sample extracted text from page 1. It will be replaced with actual text extracted from the PDF using OCR technology."
    );
    setIsProcessing(false);
  };

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    setIsLoadingPage(true);
    setCurrentPage(newPage);

    // Simulate loading new page
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate different content for different pages
    setImageUrl("/api/placeholder/400/500");
    setOcrText(
      `هذا نص تجريبي مستخرج من الصفحة ${newPage}. محتوى مختلف لكل صفحة.\n\nThis is sample extracted text from page ${newPage}. Different content for each page.`
    );

    setIsLoadingPage(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  أدوات البحث الشامل في التراث
                </h1>
                <p className="text-sm text-gray-500">
                  استخراج النصوص من ملفات PDF
                </p>
              </div>
            </div>
            <nav className="flex space-x-reverse space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-green-700 transition-colors"
              >
                القرآن
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-700 transition-colors"
              >
                الحديث
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-700 transition-colors"
              >
                التفسير
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-700 transition-colors"
              >
                الفقه
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            استخراج النصوص من ملفات PDF
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف كنوز التراث العلمي الإسلامي باستخدام أدوات الذكاء الاصطناعي
            المتقدمة المصممة للباحثين والعلماء والطلاب
          </p>
        </div>

        {/* Upload Section */}
        <FileUpload
          onFileSelect={(e) =>
            e.target.files[0] && handleFileSelect(e.target.files[0])
          }
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          fileInputRef={fileInputRef}
          handleUploadClick={handleUploadClick}
          file={file}
        />
        <ProgressBar isProcessing={isProcessing} progress={progress} />

        {/* Results Section - Only show after successful upload */}
        {file && !isProcessing && (imageUrl || ocrText) && (
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
              />
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                جاري معالجة الملف
              </h3>
              <p className="text-gray-600 mb-6">
                الرجاء الانتظار بينما نقوم باستخراج المحتوى...
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>التقدم</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PDFUploadPage;
