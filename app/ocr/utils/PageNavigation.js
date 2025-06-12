import React from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function PageNavigation({
  totalPages,
  currentPage,
  isLoadingPage,
  handlePageChange,
}) {
  const [inputPage, setInputPage] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    setInputPage(val);
  };
  const handleInputGo = (e) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage, 10);
    if (
      !isNaN(pageNum) &&
      pageNum >= 1 &&
      pageNum <= totalPages &&
      pageNum !== currentPage
    ) {
      handlePageChange(pageNum);
      setInputPage("");
    }
  };

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
          {editing ? (
            <form onSubmit={handleInputGo} className="flex items-center gap-1">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputPage}
                onChange={handleInputChange}
                onBlur={() => setEditing(false)}
                placeholder="اذهب إلى..."
                className="w-16 px-2 py-1 border rounded text-center text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                disabled={isLoadingPage}
              />
            </form>
          ) : (
            <span
              className="text-sm font-medium text-gray-900 cursor-pointer select-none"
              title="انقر للانتقال إلى صفحة معينة"
              onClick={() => {
                setInputPage("");
                setEditing(true);
              }}
            >
              {currentPage} من {totalPages}
            </span>
          )}
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
