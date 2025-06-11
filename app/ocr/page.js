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
import ToolsNav from "./utils/ToolsNav";
import FileUpload from "./utils/FileUpload";
import ProgressBar from "./utils/ProgressBar";
import PageNavigation from "./utils/PageNavigation";
import ImageDisplay from "./utils/ImageDisplay";
import TextDisplay from "./utils/TextDisplay";
import api from "../../utils/api"; 

const page = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [bookId, setBookId] = useState(null);
  const progressIntervalRef = useRef(null); // Ref to store interval ID
  const fileInputRef = useRef(null);

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
      await uploadFileToFastAPI(selectedFile);
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

  const startPollingProgress = (id) => {
    // Clear any existing interval to prevent multiple polls
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/books/${id}/progress`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch progress.");
        }
        const progressData = await response.json();
        console.log("Progress:", progressData);

        setTotalPages(progressData.total_pages);
        const currentProgress =
          progressData.total_pages > 0
            ? Math.floor(
                (progressData.processed_pages / progressData.total_pages) * 100
              )
            : 0;
        setProgress(currentProgress);

        if (progressData.status === "COMPLETED") {
          clearInterval(progressIntervalRef.current); // Stop polling
          progressIntervalRef.current = null;
          setIsProcessing(false); // Hide processing UI
          fetchBookResults(id); // Fetch final results
        } else if (progressData.status === "FAILED") {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
          setIsProcessing(false);
          alert(`معالجة الملف فشلت: ${progressData.message}`);
          setFile(null); // Clear file on failure
        }
      } catch (error) {
        console.error("Error polling progress:", error);
        clearInterval(progressIntervalRef.current); // Stop polling on error
        progressIntervalRef.current = null;
        setIsProcessing(false);
        alert(`حدث خطأ أثناء التحقق من التقدم: ${error.message}`);
        setFile(null);
      }
    }, 2000); // Poll every 2 seconds (adjust as needed)
  };

  const fetchBookResults = async (id) => {
    setIsLoadingPage(true); // Indicate loading for results display
    try {
      const response = await fetch(`http://127.0.0.1:8000/books/${id}/results`);
      if (!response.ok) {
        throw new Error("Failed to fetch book results.");
      }
      const resultData = await response.json();
      console.log("Final Results:", resultData);

      // Assuming your backend returns data for the first page for initial display
      // You'll likely need another endpoint or logic to fetch individual page data
      const firstPageText = resultData.ocr_data?.text?.page_1 || "";
      const firstPageImage = resultData.ocr_data?.images?.page_1 || "";

      setOcrText(firstPageText);
      setImageUrl(firstPageImage);
      setCurrentPage(1); // Reset to first page
      setTotalPages(resultData.ocr_data?.total_pages || 1); // Get actual total pages
    } catch (error) {
      console.error("Error fetching book results:", error);
      alert(`حدث خطأ في جلب النتائج: ${error.message}`);
    } finally {
      setIsLoadingPage(false);
    }
  };

  const uploadFileToFastAPI = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload); // 'file' must match the parameter name in your FastAPI endpoint

    setIsProcessing(true); // Start showing processing UI immediately
    setProgress(0); // Reset progress bar
    setImageUrl(""); // Clear previous results
    setOcrText("");
    setFile(fileToUpload); // Set the selected file in state

    try {
      // Use the Axios instance to make the POST request
      const response = await api.post("/books/upload", formData, {
        // Using '/upload' relative to baseURL
        headers: {
          "Content-Type": "multipart/form-data", // Essential for file uploads with FormData
        },
        onUploadProgress: (progressEvent) => {
          // This callback updates the progress specifically for the upload phase
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      const result = response.data; // Axios automatically parses JSON response into .data
      console.log("Upload initiated/successful:", result);

      // Now, assuming your FastAPI immediately returns a book ID and potentially total pages
      // so you can start polling for OCR progress.
      setBookId(result.book_id); // Assuming your FastAPI returns book_id in the response
      setTotalPages(result.total_pages || 0); // May be 0 initially if total pages are determined during OCR
      // You might also get an initial message or status from `result.message` or `result.status`

      // Start polling for OCR progress (as discussed previously)
      // startPollingProgress(result.book_id);
    } catch (error) {
      console.error("Error during file upload to FastAPI:", error);
      // Axios error handling is more robust; error.response, error.request, error.message
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "فشل رفع الملف إلى الخادم";
      alert(`حدث خطأ أثناء رفع الملف: ${errorMessage}`);
      setIsProcessing(false);
      setFile(null); // Clear the file on error
      setProgress(0); // Reset progress
    }
  };

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
            {/* Replace the nav with ToolsNav */}
            <ToolsNav />
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

export default page;
