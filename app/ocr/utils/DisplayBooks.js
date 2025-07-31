import React from "react";
import { Trash2 } from "lucide-react";

function DisplayBooks({
  books,
  deletingBooks,
  getFullImageUrl,
  handleBookClick,
  handleDeleteBook,
  isLoadingPage,
  isProcessing,
  searchQuery,
  setSearchQuery,
  fetchBooksPage,
  booksPage,
  totalBooks,
  booksPerPage,
  hasPrev,
  hasNext,
  setIsLoadingPage
}) {
  return (
    <div className="px-4 py-4">
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            setIsLoadingPage(true);
            await fetchBooksPage(1, e.target.value);
            setIsLoadingPage(false);
          }
        }}
        placeholder="بحث عن كتاب..."
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-500"
      />
      {/* Book List Content */}
      {/* Circle spinner while loading books */}
      {isLoadingPage && !isProcessing && (
        <div className="w-full flex justify-center items-center mb-4">
          <svg className="animate-spin h-10 w-10 text-green-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {books.length === 0 ? (
        <div className="text-center text-gray-500">لا توجد كتب</div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => {
            let img = getFullImageUrl(book.pages?.[0]?.image_path);
            const bookKey = book._id || book.id;
            const isDeleting = deletingBooks.has(bookKey);
            return (
              <div
                key={bookKey}
                className={`bg-white border rounded-lg shadow p-3 flex items-center
                   gap-3 relative cursor-pointer hover:shadow-lg transition-all duration-300
                   ease-in-out transform ${isDeleting ? 'opacity-0 scale-95 -translate-x-6' : 'opacity-100 scale-100 translate-x-0'}`}
                onClick={async (e) => {
                  if (e.target.closest("button")) return;
                  await handleBookClick(bookKey);
                }}
              >
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    // Add this book to deletingBooks set
                    setIsLoadingPage(true);
                    setTimeout(() => {
                      handleDeleteBook(bookKey);
                      setIsLoadingPage(false);
                    }, 300);
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
                    className="w-16 h-20 object-contain border rounded"
                  />
                ) : (
                  <div className="w-16 h-20 flex items-center justify-center bg-gray-200 rounded text-gray-400">📄</div>
                )}

                <div className="flex-1 text-right">
                  <div className="font-bold text-gray-800">
                    {book.title || book.name || "بدون عنوان"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalBooks > booksPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={async () => {
              if (hasPrev) {
                setIsLoadingPage(true);
                await fetchBooksPage(booksPage - 1, searchQuery);
                setIsLoadingPage(false);
              }
            }}
            disabled={!hasPrev}
            className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
          >
            السابق
          </button>
          <span className="px-3 py-1 mx-1">{booksPage} / {Math.max(1, Math.ceil(totalBooks / booksPerPage))}</span>
          <button
            onClick={async () => {
              if (hasNext) {
                setIsLoadingPage(true);
                await fetchBooksPage(booksPage + 1, searchQuery);
                setIsLoadingPage(false);
              }
            }}
            disabled={!hasNext}
            className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}

export default DisplayBooks;
