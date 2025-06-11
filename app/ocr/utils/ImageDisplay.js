import React, { useState } from "react";
import { Loader2, Image, ZoomIn, ZoomOut } from "lucide-react";

export default function ImageDisplay({ imageUrl, isLoadingPage, currentPage, totalPages }) {
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleMouseDown = (e) => {
    if (zoom === 1) return;
    setDrag(true);
    setStart({ x: e.clientX - imgOffset.x, y: e.clientY - imgOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!drag) return;
    const newX = e.clientX - start.x;
    const newY = e.clientY - start.y;
    setImgOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDrag(false);
  };

  // Reset drag offset when zoom resets
  React.useEffect(() => {
    if (zoom === 1) setImgOffset({ x: 0, y: 0 });
  }, [zoom]);

  return (
    <div className="mt-11 bg-gray-50 rounded-xl p-4 min-h-[500px] flex items-center justify-center border-2 border-gray-200 relative">
      {/* Zoom Controls */}
      <div className="absolute top-2 left-2 flex gap-2 z-10">
        <button onClick={handleZoomOut} className="bg-white border rounded p-1 shadow hover:bg-gray-100" title="تصغير">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button onClick={handleResetZoom} className="bg-white border rounded p-1 shadow hover:bg-gray-100" title="إعادة الضبط">
          <span className="font-bold text-xs">100%</span>
        </button>
        <button onClick={handleZoomIn} className="bg-white border rounded p-1 shadow hover:bg-gray-100" title="تكبير">
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>
      {isLoadingPage ? (
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الصفحة...</p>
        </div>
      ) : imageUrl ? (
        <div
          className="w-full h-[480px] flex items-center justify-center overflow-hidden cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ userSelect: drag ? "none" : "auto" }}
        >
          <img
            src={imageUrl}
            alt={`PDF Preview - Page ${currentPage}`}
            className="max-w-none max-h-none rounded-lg shadow-md object-contain transition-transform duration-200"
            style={{ height: "100%", width: "100%", transform: `scale(${zoom}) translate(${imgOffset.x / zoom}px, ${imgOffset.y / zoom}px)` }}
            draggable={false}
          />
        </div>
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
