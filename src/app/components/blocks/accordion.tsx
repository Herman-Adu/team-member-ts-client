"use client";

import { useState } from "react";

export interface AccordionBlock {
  __component: "blocks.accordion";
  id: number;
  title: string;
  content: string;
}

export function AccordionBlock({ block }: { block: AccordionBlock }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mt-14 mb-14 rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out">
      <button
        className={`w-full flex justify-between items-center p-4 bg-gray-200 hover:bg-gray-300 transition-colors duration-300 ease-in-out ${
          isExpanded ? "bg-gray-300" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="text-lg font-semibold text-slate-500">
          {block.title}
        </span>
        <span
          className={`text-3xl text-orange-600 transition-transform duration-300 ease-in-out ${
            isExpanded ? "transform rotate-180" : ""
          }`}
        >
          {isExpanded ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="p-4 bg-white richtext">
          <p>{block.content}</p>
        </div>
      </div>
    </div>
  );
}
