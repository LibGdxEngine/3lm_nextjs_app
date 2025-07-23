"use client";
import { useRouter } from "next/navigation";
import {
  ScanText,
  Database,
  Search,
  MessageSquare,
  Network,
  Clock,
  Quote,
  GitCompare,
  FileDown,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    id: "ocr",
    title: "أستخراج النصوص",
    description:
      "استخراج النصوص من المخطوطات القديمة والصور والمستندات باستخدام تقنية التعرف الضوئي على الحروف العربية المتقدمة",
    icon: ScanText,
    color: "from-blue-500 to-cyan-500",
    features: [
      "النصوص العربية",
      "الخطوط العربية",
      "PDF معالجة ملفات",
    ],
    delay: "0s",
  },
  {
    id: "ner",
    title: "Named Entity Recognition",
    description:
      "Identify and structure entities like scholars, places, dates, and concepts from Islamic texts",
    icon: Database,
    color: "from-purple-500 to-violet-500",
    features: ["Scholar Names", "Historical Places", "Date Extraction"],
    delay: "0.1s",
  },
  {
    id: "search",
    title: "Advanced Search & Analysis",
    description:
      "Perform semantic searches across vast collections of Islamic literature and scholarly works",
    icon: Search,
    color: "from-emerald-500 to-teal-500",
    features: ["Semantic Search", "Cross-Reference", "Topic Modeling"],
    delay: "0.2s",
  },
  {
    id: "qa",
    title: "AI Q&A Assistant",
    description:
      "Get intelligent answers from Islamic texts using advanced language models trained on scholarly works",
    icon: MessageSquare,
    color: "from-orange-500 to-red-500",
    features: ["Hadith Analysis", "Quranic Insights", "Scholarly Opinions"],
    delay: "0.3s",
  },
  {
    id: "graph",
    title: "Knowledge Graph View",
    description:
      "Visualize relationships between Islamic concepts, scholars, and historical events in interactive graphs",
    icon: Network,
    color: "from-pink-500 to-rose-500",
    features: ["Entity Relations", "Scholar Networks", "Concept Maps"],
    delay: "0.4s",
  },
  {
    id: "timeline",
    title: "Timeline Generation",
    description:
      "Create chronological timelines of Islamic history, scholarly developments, and biographical events",
    icon: Clock,
    color: "from-indigo-500 to-blue-500",
    features: ["Historical Events", "Biographical Data", "Era Analysis"],
    delay: "0.5s",
  },
  {
    id: "citations",
    title: "Citations & References",
    description:
      "Find and verify citations, cross-references, and scholarly sources across Islamic literature",
    icon: Quote,
    color: "from-green-500 to-emerald-500",
    features: [
      "Source Verification",
      "Citation Networks",
      "Reference Tracking",
    ],
    delay: "0.6s",
  },
  {
    id: "comparison",
    title: "Document Comparison",
    description:
      "Compare different versions of texts, manuscripts, and scholarly interpretations side by side",
    icon: GitCompare,
    color: "from-yellow-500 to-orange-500",
    features: ["Text Diff Analysis", "Manuscript Variants", "Version Control"],
    delay: "0.7s",
  },
  {
    id: "export",
    title: "Export & Reports",
    description:
      "Generate comprehensive reports and export your research in various formats for publication",
    icon: FileDown,
    color: "from-gray-500 to-slate-500",
    features: ["PDF Reports", "Data Export", "Academic Formatting"],
    delay: "0.8s",
  },
];

export default function ResearchTools() {
  const router = useRouter();
  const handleToolClick = (toolId) => {
    // For now, we'll log and show an alert
    // In a real app, you'd use Next.js router
    if (toolId === "ocr") {
      router.push("/ocr");
      return;
    }
    console.log(`Navigating to ${toolId} tool`);
    alert(
      `Navigating to ${toolId.toUpperCase()} tool. This would redirect to /tools/${toolId}`
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            أدوات البحث والميزات
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            مجموعة شاملة من الأدوات المدعومة بالذكاء الاصطناعي، مصممة خصيصًا للبحوث والدراسات الإسلامية
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isComingSoon = tool.id !== "ocr"; // Only OCR is live, others are WIP
            return (
              <div
                key={tool.id}
                className="group islamic-card card-hover p-8 animate-slide-up relative"
                style={{ animationDelay: tool.delay }}
              >
                {/* Cover for WIP tools */}
                {isComingSoon && (
                  <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-20 rounded-xl">
                    <span className="text-lg font-bold text-gray-700 mb-2">قريباً</span>
                    <span className="text-sm text-gray-500">نحن نعمل على هذه الأداة</span>
                  </div>
                )}
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-islamic-green transition-colors duration-300">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <div className="w-1.5 h-1.5 bg-islamic-teal rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleToolClick(tool.id)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-islamic-green to-islamic-teal text-white font-semibold rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg"
                >
                  <span>Use Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div
          className="text-center mt-16 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div className="bg-gradient-to-r from-islamic-green/10 to-islamic-teal/10 rounded-2xl p-8 border border-islamic-green/20">
            <h3 className="text-2xl font-bold gradient-text mb-4">
              Ready to Transform Your Research?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of researchers and scholars who are already using
              our platform to unlock new insights from Islamic texts
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-islamic-green to-islamic-teal text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Start Your Research Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
