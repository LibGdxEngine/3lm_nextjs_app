import React from "react";
import { FileText, CheckCircle, Loader2 } from "lucide-react";
import CopyButton from "./CopyButton";

export default function TextDisplay({
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
          <CopyButton text={ocrText} />
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
