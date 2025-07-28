"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  FileText,
  Search,
  Trash2
} from "lucide-react";
import ToolsNav from "./utils/ToolsNav";
import FileUpload from "./utils/FileUpload";
import UploadProgress from "./utils/UploadProgress";
import ApiService from "../api/ApiService";
import ResultsSection from "./utils/ResultsSection";

const api = new ApiService("https://192.168.60.100/api/v1/ocr");

function getFullImageUrl(imagePath) {
  if (!imagePath) return "";
  if (!imagePath.startsWith("/app")) {
    imagePath = `/app${imagePath.startsWith("/") ? imagePath : "/" + imagePath}`;
  }
  let base = api.baseUrl || "";
  base = base.replace(/\/api\/v1\/ocr$/, "");
  return `${base}${imagePath}`;
}

const Page = () => {
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
  const [books, setBooks] = useState([]);
  const [showBooks, setShowBooks] = useState(false);
  const [booksPage, setBooksPage] = useState(1);
  const booksPerPage = 3;
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("الرجاء اختيار ملف PDF صالح");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true); // Show loading bar immediately (uploading)
    setProgress(-1); // -1 means indeterminate
    setImageUrl("");
    setOcrText("");

    try {
      // Show loading bar (indeterminate) until upload completes
      await uploadFileToFastAPI(selectedFile);
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("حدث خطأ في معالجة الملف");
      setIsProcessing(false);
      setProgress(0);
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

  // Helper to update progress based on processed_pages/total_pages
  const updateProgressFromBook = (book) => {
    if (book && book.total_pages > 0) {
      setProgress(Math.round((book.processed_pages / book.total_pages) * 100));
    }
  };

  // Polling function to check book status every 3 seconds
  const pollBookStatus = async (id, maxAttempts = 6000) => {
    let attempts = 0;
    setIsLoadingPage(true);
    let lastPageShown = false;
    while (attempts < maxAttempts) {
      try {
        const resultData = await api.get(`books/${id}`);
        updateProgressFromBook(resultData);
        if (resultData.status === "FAILED") {
          setIsLoadingPage(false);
          setIsProcessing(false);
          alert("فشلت المعالجة. يرجى المحاولة لاحقًا.");
          return;
        }
        const firstPage = resultData.pages && resultData.pages[0];
        let firstPageImage = getFullImageUrl(firstPage?.image_path);
        const firstPageText = firstPage?.text || "";
        // Always update the UI with the latest available page
        if (firstPage) {
          setOcrText(firstPageText);
          setImageUrl(firstPageImage);
          setCurrentPage(1);
          setTotalPages(resultData.total_pages || 1);
          lastPageShown = true;
        }
        if (resultData.status === "COMPLETED") {
          setIsLoadingPage(false);
          setIsProcessing(false);
          return;
        }
      } catch (error) {
        console.error("Error polling book results:", error);
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 6000));
    }
    setIsLoadingPage(false);
    setIsProcessing(false);
    if (!lastPageShown) {
      alert("المعالجة لم تكتمل بعد. يرجى المحاولة لاحقًا.");
    }
  };

  const uploadFileToFastAPI = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload); // 'file' must match the parameter name in your FastAPI endpoint

    // Don't set isProcessing here, already set in handleFileSelect
    setImageUrl("");
    setOcrText("");
    setFile(fileToUpload);

    try {
      // Use the ApiService instance to make the POST request
      const result = await api.post("books/upload", formData, {
        timeout: 180000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Now that upload is done, switch to processing state and start progress count
      setIsProcessing(true); // Still processing
      setProgress(0); // Start progress at 0
      setBookId(result._id); // Use 'id' instead of 'book_id' as per backend
      setTotalPages(result.total_pages || 0);
      updateProgressFromBook(result);
      // Start polling for book status (progress bar will now reflect real progress)
      pollBookStatus(result._id);
      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Error during file upload to FastAPI:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "فشل رفع الملف إلى الخادم";
      setIsProcessing(false);
      setFile(null);
      setProgress(0);
      alert(`حدث خطأ أثناء رفع الملف: ${errorMessage}`);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    setIsLoadingPage(true);
    setCurrentPage(newPage);

    try {
      // Fetch the specific page data from the backend
      const pageData = await api.get(`books/${bookId}/pages/${newPage}`);
      let pageImage = getFullImageUrl(pageData?.image_path);
      setImageUrl(pageImage);
      setOcrText(pageData?.text || "");
    } catch (error) {
      console.error("Error fetching page data:", error);
      alert("حدث خطأ أثناء جلب بيانات الصفحة");
    }
    setIsLoadingPage(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const fetchAllBooks = async () => {
    if (showBooks) {
      setShowBooks(false);
      return;
    }
    try {
      const res = await api.get("books");
      const booksArr = Array.isArray(res) ? res : res || [];
      setBooks(booksArr);
      setBooksPage(1);
      setShowBooks(true);
    } catch (error) {
      // Enhanced error logging for debugging
      console.error("Error fetching all books:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      alert("تعذر جلب جميع الكتب\nراجع سجل الأخطاء لمزيد من التفاصيل");
      setBooks([]);
      setShowBooks(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الكتاب؟")) return;
    try {
      setShowBooks(false);
      await api.delete(`books/${bookId}`);
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
    } catch (error) {
      alert("فشل حذف الكتاب");
    }
  };

  // Add save handler
  const handleSaveText = async () => {
    if (!bookId || !currentPage) return;
    try {
      // Get the page id for the current page
      const book = books.find((b) => (b._id || b.id) === bookId);
      let pageId = null;
      if (book && Array.isArray(book.pages)) {
        const pageObj = book.pages.find((p) => p.page_number === currentPage || p.page_num === currentPage);
        pageId = pageObj?._id || pageObj?.id || null;
      }
      // Fallback: try to get page id from backend if not found
      if (!pageId) {
        try {
          const pageData = await api.get(`books/${bookId}/pages/${currentPage}`);
          pageId = pageData._id || pageData.id || null;
        } catch {}
      }
      if (!pageId) {
        alert("تعذر تحديد الصفحة المطلوبة للحفظ");
        return;
      }
      await api.put(`books/${bookId}/pages/${pageId}`, { new_text: ocrText });
      console.log(bookId, pageId, ocrText);
      alert("تم حفظ النص بنجاح");
      return;
    } catch (error) {
      alert("فشل حفظ النص. تحقق من صيغة البيانات أو من الخادم.");
    }
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
        {/* <ProgressBar isProcessing={isProcessing} /> */}

        {/* Results Section - Only show after successful upload */}
        {file && !isProcessing && (imageUrl || ocrText) && (
          <ResultsSection
            imageUrl={imageUrl}
            ocrText={ocrText}
            isLoadingPage={isLoadingPage}
            currentPage={currentPage}
            totalPages={totalPages}
            setOcrText={setOcrText}
            bookId={bookId}
            handlePageChange={handlePageChange}
            handleSaveText={handleSaveText}
          />
        )}

        {/* Processing State */}
        {isProcessing && (
          <UploadProgress isProcessing={isProcessing} progress={progress} />
        )}

        {/* Button to fetch and display books as cards */}
        <div className="flex gap-4 my-4">
          <button
            onClick={async () => {
              if (isProcessing) return; // Disable while uploading/processing
              setIsLoadingPage(true); // Show progress bar for books loading
              await fetchAllBooks();
              setIsLoadingPage(false);
            }}
            className={`bg-green-600 text-white px-4 py-2 rounded shadow${isProcessing ? ' opacity-50 cursor-not-allowed' : ''}`}
            disabled={isProcessing}
          >
            {showBooks ? "إخفاء الكتب" : "عرض جميع الكتب"}
          </button>
        </div>
        {/* Progress bar for books loading */}
        {isLoadingPage && !showBooks && !isProcessing && (
          <div className="w-full flex justify-center mb-4">
            <div className="w-1/2 bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
        {showBooks && (
          <>
            {/* Progress bar when loading a book */}
            {isLoadingPage && !isProcessing && (
              <div className="w-full flex justify-center mb-4">
                <div className="w-1/2 bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {books.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                  لا توجد كتب
                </div>
              )}
              {books
                .slice((booksPage - 1) * booksPerPage, booksPage * booksPerPage)
                .map((book) => {
                  let img = getFullImageUrl(book.pages && book.pages[0] && book.pages[0].image_path);
                  return (
                    <div
                      key={book._id || book.id}
                      className="bg-white border rounded-lg shadow p-4 flex flex-col items-center relative cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={async (e) => {
                        if (e.target.closest("button")) return;
                        setIsLoadingPage(true); // Show progress bar for book loading
                        try {
                          const resultData = await api.get(`books/${book._id || book.id}`);
                          setBookId(book._id || book.id);
                          setFile({ name: book.title || book.name || "بدون عنوان" });
                          setTotalPages(resultData.total_pages || 1);
                          setCurrentPage(1);
                          const firstPage = resultData.pages && resultData.pages[0];
                          let firstPageImage = getFullImageUrl(firstPage?.image_path);
                          setImageUrl(firstPageImage);
                          setOcrText(firstPage?.text || "");
                          setShowBooks(false);
                        } catch (error) {
                          alert("تعذر جلب بيانات الكتاب");
                        }
                        setIsLoadingPage(false); // Hide progress bar after book is loaded
                      }}
                    >
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteBook(book._id || book.id);
                          setFile(null); // Clear file state when deleting book
                        }}
                        className="absolute bottom-2 left-2 text-red-500 hover:text-red-700"
                        title="حذف الكتاب"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {img ? (
                        <img
                          src={img}
                          alt={book.title || book.name || "بدون عنوان"}
                          className="w-full h-40 object-contain rounded mb-3 bg-white border"
                        />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded mb-3 text-gray-400">
                          <span className="w-12 h-12">📄</span>
                        </div>
                      )}
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {book.title || book.name || "بدون عنوان"}
                      </div>
                    </div>
                  );
                })}
            </div>

            {books.length > booksPerPage && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setBooksPage((p) => Math.max(1, p - 1))}
                  disabled={booksPage === 1}
                  className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
                >
                  السابق
                </button>
                <span className="px-3 py-1 mx-1">{booksPage} / {Math.ceil(books.length / booksPerPage)}</span>
                <button
                  onClick={() => setBooksPage((p) => Math.min(Math.ceil(books.length / booksPerPage), p + 1))}
                  disabled={booksPage === Math.ceil(books.length / booksPerPage)}
                  className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Page;
