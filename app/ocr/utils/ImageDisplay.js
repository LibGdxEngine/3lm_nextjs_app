import React from "react";
import { Loader2, Image } from "lucide-react";

export default function ImageDisplay({ imageUrl, isLoadingPage, currentPage, totalPages }) {
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
