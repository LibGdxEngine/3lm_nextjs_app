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
import DisplayBooks from "./utils/DisplayBooks";

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
  const [deletingBooks, setDeletingBooks] = useState(new Set());
  const booksPerPage = 5;
  // Track total books for pagination
  const [totalBooks, setTotalBooks] = useState(0);
  // Track has_prev/has_next for pagination controls
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("الرجاء اختيار ملف PDF صالح");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true); // Show loading bar immediately (uploading)
    setProgress(0);
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
      setProgress(Math.round(book.progress));
    }
  };

  // Polling function to check book status every 3 seconds
  // Polling function to check book progress using /progress endpoint (expects status in response)
  const pollBookStatus = async (id, maxAttempts = 6000) => {
    let attempts = 0;
    setIsLoadingPage(true);
    let processingDone = false;
    while (attempts < maxAttempts) {
      try {
        // Only poll the progress endpoint
        const progressData = await api.get(`books/${id}/progress`);
        // progressData: { total_pages, processed_pages, progress, status }
        setTotalPages(progressData.total_pages || 1);
        setProgress(Math.round(progressData.progress));
        if (progressData.status === "FAILED") {
          setIsLoadingPage(false);
          setIsProcessing(false);
          alert("فشلت المعالجة. يرجى المحاولة لاحقًا.");
          return;
        }
        // If processing is done, fetch the book data once
        if (progressData.status === "COMPLETED" && progressData.progress >= 100 && progressData.processed_pages === progressData.total_pages) {
          console.log(progressData)
          const resultData = await api.get(`books/${id}`);
          const firstPage = resultData.pages && resultData.pages[0];
          let firstPageImage = getFullImageUrl(firstPage?.image_path);
          const firstPageText = firstPage?.text || "";
          if (firstPage) {
            setOcrText(firstPageText);
            setImageUrl(firstPageImage);
            setCurrentPage(1);
            setTotalPages(resultData.total_pages || 1);
          }
          setIsLoadingPage(false);
          setIsProcessing(false);
          processingDone = true;
          return;
        }
      } catch (error) {
        console.error("Error polling progress:", error);
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 7000));
    }
    setIsLoadingPage(false);
    setIsProcessing(false);
    if (!processingDone) {
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
      await pollBookStatus(result._id);
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

  // Fetch books for a specific page using skip/limit
  const [searchQuery, setSearchQuery] = useState("");
  const fetchBooksPage = async (page = 1, query = "") => {
    try {
      const skip = (page - 1) * booksPerPage;
      const limit = booksPerPage;
      const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
      const res = await api.get(`books?skip=${skip}&limit=${limit}${searchParam}`);
      console.log("Fetched books:", res);
      // New backend format: { total, has_prev, has_next, data: [...] }
      const booksArr = Array.isArray(res.data) ? res.data : [];
      const totalCount = typeof res.total === 'number' ? res.total : booksArr.length;
      setBooks(booksArr);
      setBooksPage(page);
      setShowBooks(true);
      setTotalBooks(totalCount);
      setHasPrev(!!res.has_prev);
      setHasNext(!!res.has_next);
    } catch (error) {
      console.error("Error fetching books page:", error);
      alert("تعذر جلب الكتب لهذه الصفحة");
      setBooks([]);
      setShowBooks(true);
      setTotalBooks(0);
      setHasPrev(false);
      setHasNext(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الكتاب؟")) return;
    try {
      // setShowBooks(false);
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
        } catch { }
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
              if (isProcessing) return;
              setBooks([]); // Clear previous results
              setShowBooks(true); // Show sidebar immediately
              setIsLoadingPage(true);
              await fetchBooksPage(1, searchQuery);
              setIsLoadingPage(false);
            }}
            className={`bg-green-600 text-white px-4 py-2 rounded shadow${isProcessing ? ' opacity-50 cursor-not-allowed' : ''}`}
            disabled={isProcessing}
          >
            {showBooks ? "إخفاء الكتب" : "عرض جميع الكتب"}
          </button>
        </div>
        {/* Remove old progress bar for books loading */}
        {showBooks && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowBooks(false)}
            />
            {/* Sliding Panel */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h2 className="text-xl font-semibold">الكتب</h2>
                <button onClick={() => setShowBooks(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              {/* Book List & Controls */}
              <DisplayBooks
                books={books}
                deletingBooks={deletingBooks}
                getFullImageUrl={getFullImageUrl}
                handleBookClick={async (bookKey) => {
                  setIsLoadingPage(true);
                  try {
                    const resultData = await api.get(`books/${bookKey}`);
                    setBookId(bookKey);
                    setFile({ name: books.find(b => (b._id || b.id) === bookKey)?.title || books.find(b => (b._id || b.id) === bookKey)?.name || "بدون عنوان" });
                    setTotalPages(resultData.total_pages || 1);
                    setCurrentPage(1);
                    const firstPageImage = getFullImageUrl(resultData.pages?.[0]?.image_path);
                    setImageUrl(firstPageImage);
                    setOcrText(resultData.pages?.[0]?.text || "");
                    setShowBooks(false);
                  } catch (error) {
                    alert("تعذر جلب بيانات الكتاب");
                  }
                  setIsLoadingPage(false);
                }}
                handleDeleteBook={(bookKey) => {
                  setDeletingBooks(prev => new Set([...prev, bookKey]));
                  setTimeout(() => {
                    handleDeleteBook(bookKey);
                    setFile(null);
                    setDeletingBooks(prev => {
                      const updated = new Set(prev);
                      updated.delete(bookKey);
                      return updated;
                    });
                  }, 300);
                }}
                isLoadingPage={isLoadingPage}
                isProcessing={isProcessing}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                fetchBooksPage={fetchBooksPage}
                booksPage={booksPage}
                totalBooks={totalBooks}
                booksPerPage={booksPerPage}
                hasPrev={hasPrev}
                hasNext={hasNext}
                setIsLoadingPage={setIsLoadingPage}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Page;
