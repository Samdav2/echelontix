"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  title: string;
  content: string;
  index: number;
  activeIndex: number | null;
  onAccordionClick: (index: number) => void;
}

const AccordionItem: React.FC<AccordionProps> = ({
  title,
  content,
  activeIndex,
  index,
  onAccordionClick,
}) => {
  const isActive = index === activeIndex;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden`}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-6 py-5 cursor-pointer select-none"
        onClick={() => onAccordionClick(index)}
      >
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h3>
        {isActive ? (
          <ChevronUp className="w-6 h-6 text-blue-500 transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500 transition-transform duration-300" />
        )}
      </div>

      {/* Animated Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-gray-600 text-base md:text-lg leading-relaxed">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionItem;
