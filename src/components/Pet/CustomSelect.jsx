import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CustomSelect = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Select option",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-black rounded-xl text-stone-900 font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none outline-none focus:border-emerald-500
          ${disabled ? "opacity-50 cursor-not-allowed bg-stone-100 shadow-none translate-x-0 translate-y-0" : "cursor-pointer hover:bg-stone-50"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption && selectedOption.icon && (
            <span className="flex-shrink-0 flex items-center">{selectedOption.icon}</span>
          )}
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-stone-900 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options List */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-2 max-h-60 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-y-auto"
          >
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-stone-400 font-bold">No options available</li>
            ) : (
              options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-emerald-50 hover:text-emerald-700
                      ${
                        value === option.value
                          ? "bg-emerald-50 text-emerald-700 font-black"
                          : "text-stone-700"
                      }`}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0 flex items-center">{option.icon}</span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </button>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default CustomSelect;
