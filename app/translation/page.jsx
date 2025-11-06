"use client";

import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function TranslationUI() {
  const [file, setFile] = useState(null);
  const [batchSize, setBatchSize] = useState(20);
  const [configs, setConfigs] = useState([
    { column_name: "", from_language: "الإنجليزية", to_language: "العربية", description: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCaches, setIsLoadingCaches] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [result, setResult] = useState(null); // raw API response
  const [caches, setCaches] = useState([]);
  const [selectedCacheIds, setSelectedCacheIds] = useState(new Set());

  const inputRef = useRef(null);

  const normalized = useMemo(() => normalizeResult(result), [result]);

  async function onFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    
    // Extract column names from Excel file
    if (f) {
      try {
        const arrayBuffer = await f.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON to get column names
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          // First row contains column headers
          const columnNames = jsonData[0].filter(name => name != null && String(name).trim() !== "");
          
          if (columnNames.length > 0) {
            // Create configs for each column
            const newConfigs = columnNames.map((columnName) => ({
              column_name: String(columnName).trim(),
              from_language: "الإنجليزية",
              to_language: "العربية",
              description: "",
            }));
            
            setConfigs(newConfigs);
          }
        }
      } catch (error) {
        console.error("Error reading Excel file:", error);
        setApiMessage("حدث خطأ في قراءة ملف الإكسل. تأكد من أن الملف صالح.");
      }
    } else {
      // Reset configs if no file is selected
      setConfigs([{ column_name: "", from_language: "الإنجليزية", to_language: "العربية", description: "" }]);
    }
  }

  function addConfig() {
    setConfigs((prev) => [
      ...prev,
      { column_name: "", from_language: "", to_language: "", description: "" },
    ]);
  }

  function removeConfig(idx) {
    setConfigs((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateConfig(idx, key, value) {
    setConfigs((prev) => prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiMessage("");

    if (!file) {
      setApiMessage("يرجى اختيار ملف إكسل .xlsx أولاً.");
      return;
    }

    const pruned = configs
      .map((c) => ({
        column_name: (c.column_name || "").trim(),
        from_language: (c.from_language || "").trim(),
        to_language: (c.to_language || "").trim(),
        description: (c.description || "").trim(),
      }))
      .filter((c) => c.column_name && c.from_language && c.to_language);

    if (pruned.length === 0) {
      setApiMessage("يرجى إضافة إعداد عمود ترجمة واحد صالح على الأقل.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("column_configs", JSON.stringify(pruned));
    if (batchSize && Number(batchSize) > 0) {
      formData.append("batch_size", String(Number(batchSize)));
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/translate`, {
        method: "POST",
        body: formData,
      });

      const payload = await parseJsonSafe(res);
      if (!res.ok) {
        throw new Error(extractErrorMessage(payload) || res.statusText);
      }
      setResult(payload);
      setApiMessage("تمت الترجمة بنجاح.");
    } catch (err) {
      console.error(err);
      setResult(null);
      setApiMessage(String(err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function fetchCaches() {
    setIsLoadingCaches(true);
    setApiMessage("");
    try {
      const res = await fetch(`${API_BASE}/cache/list`);
      const payload = await parseJsonSafe(res);
      if (!res.ok) throw new Error(extractErrorMessage(payload) || res.statusText);
      setCaches(Array.isArray(payload) ? payload : []);
      setSelectedCacheIds(new Set());
    } catch (err) {
      console.error(err);
      setApiMessage(String(err.message || err));
    } finally {
      setIsLoadingCaches(false);
    }
  }

  async function deleteSelectedCaches() {
    if (selectedCacheIds.size === 0) return;
    setIsLoadingCaches(true);
    setApiMessage("");
    try {
      const body = { cache_ids: Array.from(selectedCacheIds) };
      const res = await fetch(`${API_BASE}/cache`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await parseJsonSafe(res);
      if (!res.ok) throw new Error(extractErrorMessage(payload) || res.statusText);
      // Refresh list afterwards
      await fetchCaches();
      setApiMessage(
        `تم حذف: ${payload?.deleted?.length ?? 0}؛ غير موجود: ${payload?.not_found?.length ?? 0}`
      );
    } catch (err) {
      console.error(err);
      setApiMessage(String(err.message || err));
    } finally {
      setIsLoadingCaches(false);
    }
  }

  function toggleCacheSelection(id) {
    setSelectedCacheIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  function clearForm() {
    setFile(null);
    inputRef.current?.value && (inputRef.current.value = "");
    setBatchSize(20);
    setConfigs([{ column_name: "", from_language: "الإنجليزية", to_language: "العربية", description: "" }]);
    setResult(null);
    setApiMessage("");
  }

  function handleDownloadCSV() {
    if (!normalized || normalized.rows.length === 0) return;
    const csv = toCSV(normalized.rows, normalized.columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translated.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900" dir="rtl" lang="ar">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">واجهة خدمة الترجمة</h1>
          <p className="text-slate-600 mt-2">
            قم برفع ملف إكسل، ثم ضبط إعدادات الأعمدة المطلوب ترجمتها، واستعراض أو تحميل النتائج. يمكنك أيضاً إدارة ذاكرة التخزين المؤقت للترجمة في الخادم.
          </p>
        </header>

        {/* Alerts / Messages */}
        {apiMessage ? (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-block h-3 w-3 rounded-full bg-slate-400" />
              <p className="leading-relaxed whitespace-pre-wrap">{apiMessage}</p>
            </div>
          </div>
        ) : null}

        {/* Upload + Config */}
        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="text-lg font-medium">١) الرفع والإعداد</h2>

            <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium">ملف إكسل (.xlsx)</label>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="mt-2 block w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-sm"
                  onChange={onFileChange}
                />
                {file ? (
                  <p className="mt-2 text-xs text-slate-500">تم الاختيار: {file.name}</p>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">لم يتم اختيار أي ملف بعد.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">حجم الدُفعة (اختياري)</label>
                <input
                  type="number"
                  min={1}
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                  className="mt-2 w-40 rounded-md border border-slate-300 bg-white p-2 text-sm"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium">إعدادات ترجمة الأعمدة</label>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                    onClick={addConfig}
                  >
                    + إضافة إعداد
                  </button>
                </div>

                <div className="space-y-3">
                  {configs.map((cfg, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 p-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <LabeledInput
                          label="اسم العمود"
                          placeholder="مثال: الاسم"
                          value={cfg.column_name}
                          onChange={(v) => updateConfig(idx, "column_name", v)}
                        />
                        <LabeledInput
                          label="من اللغة"
                          placeholder="مثال: الإنجليزية"
                          value={cfg.from_language}
                          onChange={(v) => updateConfig(idx, "from_language", v)}
                        />
                        <LabeledInput
                          label="إلى اللغة"
                          placeholder="مثال: العربية"
                          value={cfg.to_language}
                          onChange={(v) => updateConfig(idx, "to_language", v)}
                        />
                        <LabeledInput
                          label="وصف (اختياري)"
                          placeholder="السياق يحسن جودة الترجمة"
                          value={cfg.description}
                          onChange={(v) => updateConfig(idx, "description", v)}
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          className="text-sm text-slate-600 hover:text-red-600"
                          onClick={() => removeConfig(idx)}
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSubmitting ? "جاري الترجمة…" : "ترجم"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  إعادة ضبط
                </button>
              </div>
            </form>
          </div>


        </section>

        {/* Results */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">٢) النتائج</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {normalized?.shape ? (
                <span className="rounded-md bg-slate-100 px-2 py-1">
                  الحجم: [{normalized.shape?.[0] ?? 0}، {normalized.shape?.[1] ?? 0}]
                </span>
              ) : null}
              <button
                onClick={handleDownloadCSV}
                disabled={!normalized || normalized.rows.length === 0}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                تنزيل ملف CSV
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
            {normalized && normalized.rows.length > 0 ? (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    {normalized.columns.map((c) => (
                      <th key={c} className="px-3 py-2 font-medium">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {normalized.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      {normalized.columns.map((c) => (
                        <td key={c} className="whitespace-pre-wrap px-3 py-2 text-slate-800">{String(row?.[c] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-sm text-slate-600">لا توجد نتائج بعد. قم بتنفيذ الترجمة لعرض الجدول هنا.</div>
            )}
          </div>
        </section>

        {/* Cache Manager */}
        <section className="mb-16 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">٣) إدارة الذاكرة المؤقتة</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchCaches}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                {isLoadingCaches ? "جارٍ التحميل…" : "تحديث القائمة"}
              </button>
              <button
                onClick={deleteSelectedCaches}
                disabled={selectedCacheIds.size === 0}
                className="rounded-xl bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                حذف المحدد
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
            {caches && caches.length > 0 ? (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="w-10 px-3 py-2">
                      <input
                        type="checkbox"
                        aria-label="تحديد الكل"
                        checked={selectedCacheIds.size === caches.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCacheIds(new Set(caches.map((c) => c.cache_id)));
                          else setSelectedCacheIds(new Set());
                        }}
                      />
                    </th>
                    <th className="px-3 py-2 font-medium">معرف الذاكرة</th>
                    <th className="px-3 py-2 font-medium">العمود</th>
                    <th className="px-3 py-2 font-medium">من</th>
                    <th className="px-3 py-2 font-medium">إلى</th>
                    <th className="px-3 py-2 font-medium">الحجم (بايت)</th>
                    <th className="px-3 py-2 font-medium">المسار</th>
                    <th className="px-3 py-2 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {caches.map((c, i) => (
                    <tr key={c.cache_id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedCacheIds.has(c.cache_id)}
                          onChange={() => toggleCacheSelection(c.cache_id)}
                        />
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{c.cache_id}</td>
                      <td className="px-3 py-2">{c.column_name}</td>
                      <td className="px-3 py-2">{c.from_language}</td>
                      <td className="px-3 py-2">{c.to_language}</td>
                      <td className="px-3 py-2">{c.file_size}</td>
                      <td className="px-3 py-2 break-all">{c.file_path}</td>
                      <td className="px-3 py-2">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={async () => {
                            setSelectedCacheIds(new Set([c.cache_id]));
                            await deleteSelectedCaches();
                          }}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-sm text-slate-600">
                لا توجد ذاكرات مؤقتة بعد. اضغط <em>تحديث القائمة</em> بعد إنشاء الترجمات.
              </div>
            )}
          </div>
        </section>

        <footer className="pb-8 text-center text-xs text-slate-500">
          تم تطوير هذا المشروع بواسطة مؤسسة علم لإحياء التراث
        </footer>
      </div>
    </main>
  );
}

function LabeledInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

// ————— Helpers —————
function extractErrorMessage(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (payload?.detail) return typeof payload.detail === "string" ? payload.detail : JSON.stringify(payload.detail);
  if (payload?.message) return payload.message;
  return "";
}

async function parseJsonSafe(res) {
  let text;
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await res.json();
    text = await res.text();
    try { return JSON.parse(text); } catch (_) { return { message: text }; }
  } catch (_) {
    return { message: text || "" };
  }
}

function normalizeResult(res) {
  if (!res) return null;
  const columns = Array.isArray(res.columns) ? res.columns : [];
  const data = Array.isArray(res.data) ? res.data : [];

  // Accept either list-of-objects or list-of-arrays (paired with columns)
  let rows = [];
  if (data.length > 0) {
    if (Array.isArray(data[0])) {
      // list of arrays → zip with columns
      rows = data.map((arr) => {
        const o = {};
        columns.forEach((c, i) => {
          o[c] = arr[i];
        });
        return o;
      });
    } else if (typeof data[0] === "object") {
      rows = data;
    }
  }

  return { columns, rows, shape: res.shape };
}

function toCSV(rows, columns) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };
  const header = columns.map(esc).join(",");
  const lines = rows.map((r) => columns.map((c) => esc(r?.[c])).join(","));
  return [header, ...lines].join("\n");
}
