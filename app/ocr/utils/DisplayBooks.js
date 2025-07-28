import React from "react";
import { Trash2 } from "lucide-react";

const DisplayBooks = ({
  books,
  booksPage,
  setBooksPage,
  booksPerPage,
  isLoadingPage,
  setIsLoadingPage,
  setBookId,
  setFile,
  setTotalPages,
  setCurrentPage,
  setImageUrl,
  setOcrText,
  setShowBooks,
  handleDeleteBook,
  api,
}) => {
  return (
    <>
      <div className="flex gap-4 my-4">
        <button
          onClick={() => setShowBooks(false)}
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          إخفاء الكتب
        </button>
      </div>
      {isLoadingPage && (
        <div className="w-full flex justify-center mb-4">
          <div className="w-1/2 bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full animate-pulse"
              style={{ width: "100%" }}
            ></div>
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
          .slice(
            (booksPage - 1) * booksPerPage,
            booksPage * booksPerPage
          )
          .map((book) => {
            let img =
              book.pages && book.pages[0] && book.pages[0].image_path;
            if (img && !img.startsWith("http")) {
              img = `https://192.168.60.100${img}`;
            }
            return (
              <div
                key={book._id || book.id}
                className="bg-white border rounded-lg shadow p-4 flex flex-col items-center relative cursor-pointer hover:shadow-lg transition-shadow"
                onClick={async (e) => {
                  if (e.target.closest("button")) return;
                  setIsLoadingPage(true);
                  try {
                    const resultData = await api.get(
                      `books/${book._id || book.id}`
                    );
                    setBookId(book._id || book.id);
                    setFile({ name: book.title || book.name || "بدون عنوان" });
                    setTotalPages(resultData.total_pages || 1);
                    setCurrentPage(1);
                    const firstPage = resultData.pages && resultData.pages[0];
                    let firstPageImage = firstPage?.image_path || "";
                    if (firstPageImage && !firstPageImage.startsWith("http")) {
                      firstPageImage = `https://192.168.60.100${firstPageImage}`;
                    }
                    setImageUrl(firstPageImage);
                    setOcrText(firstPage?.text || "");
                    setShowBooks(false);
                  } catch (error) {
                    alert("تعذر جلب بيانات الكتاب");
                  }
                  setIsLoadingPage(false);
                }}
              >
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteBook(book._id || book.id);
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
          <span className="px-3 py-1 mx-1">
            {booksPage} /{" "}
            {Math.ceil(books.length / booksPerPage)}
          </span>
          <button
            onClick={() =>
              setBooksPage((p) =>
                Math.min(Math.ceil(books.length / booksPerPage), p + 1)
              )
            }
            disabled={
              booksPage === Math.ceil(books.length / booksPerPage)
            }
            className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700"
          >
            التالي
          </button>
        </div>
      )}
    </>
  );
};

export default DisplayBooks;