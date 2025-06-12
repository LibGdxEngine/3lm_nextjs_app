import React, { useState } from "react";
import { Copy } from "lucide-react";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setCopied(false);
      alert("فشل النسخ إلى الحافظة");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
        copied
          ? "bg-green-100 border-green-400 text-green-700"
          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
      }`}
      title="نسخ النص"
    >
      <Copy className="w-4 h-4" />
      {copied ? "تم النسخ!" : "نسخ النص"}
    </button>
  );
};

export default CopyButton;
