import React from "react";

const tools = [
  { name: "القرآن", href: "#" },
  { name: "الحديث", href: "#" },
  { name: "التفسير", href: "#" },
  { name: "الفقه", href: "#" },
];

export default function ToolsNav() {
  return (
    <nav className="flex space-x-reverse space-x-8">
      {tools.map((tool) => (
        <a
          key={tool.name}
          href={tool.href}
          className="text-gray-700 hover:text-green-700 transition-colors"
        >
          {tool.name}
        </a>
      ))}
    </nav>
  );
}
