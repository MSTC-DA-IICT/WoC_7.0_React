// Import necessary dependencies from react-redux and react
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

// Import theme-related dependencies
import { oneDark } from "@codemirror/theme-one-dark";
import { boysAndGirls, ayuLight, barf, cobalt, clouds } from "thememirror";

// Import constants and API functions
import { LANGUAGE_DATA } from "../config/constants";
import { executeCode } from "../API/api";

// Import Redux actions
import {
  setEditorTheme,
  setEditorLanguage,
  toggleLineWrapping,
} from "../store/varSlice";

// Import icons from react-icons
import { FaBars, FaTerminal, FaPlay, FaCode, FaPalette, FaLanguage } from "react-icons/fa";
import {setAll,setOutput} from "../store/apiResponseSlice";

// Main Menubar component
export default function Menubar({ fileSectionVisible, setFileSectionVisible, terminalVisible, setTerminalVisible, setTerminalHeight,guest }) {
  // Initialize Redux dispatch
  const dispatch = useDispatch();
  
  // Local state management
  const [loading, setLoading] = useState(false);
  const [isThemeDropdownVisible, setThemeDropdownVisible] = useState(false);
  const [isLanguageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  
  // Available themes object
  const themes = {
    oneDark,
    boysAndGirls,
    ayuLight,
    barf,
    cobalt,
    clouds,
  };
  
  // Get editor state from Redux store
  const { theme, language, codeSnippet, isLineWrapping,version} =
    useSelector((state) => state.var.editor);
  const {input} = useSelector((state) => state.response);

  // Handler for theme changes
  const handleThemeChange = (e) => {
    dispatch(setEditorTheme(e.target.value));
    setThemeDropdownVisible(false);
  };

  // Handler for language changes
  const handleLanguageChange = (e) => {
    dispatch(setEditorLanguage(e.target.value));
    setLanguageDropdownVisible(false);
  };

  // Handler for line wrapping toggle
  const handleLineWrapping = () => {
    dispatch(toggleLineWrapping());
  };

  // Function to execute code
  const runCode = async () => {
    setLoading(true);
    setTerminalVisible(true);
    dispatch(setOutput("Loading..."));
    try {
      const result = await executeCode(language, version, codeSnippet, input);
      dispatch(setAll(result)); // Update Redux store
    } catch (error) {
      console.error("Run Code error:", error);
      dispatch(setAll({ output: "Error executing code", code: 1 }));
    } finally {
      setLoading(false);
      
    }
  };
  
  // Component render
  return (
    // Main container
    <div className="bg-gray-900 text-white px-2 py-2 flex flex-wrap justify-between items-center border-b border-gray-700">
      {/* Left Section */}
      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
        {/* File section toggle button */}
        {
          guest ? null :(
          <button onClick={() => setFileSectionVisible(!fileSectionVisible)}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 flex items-center justify-center shadow-md">
          <FaBars className="text-lg" />
          </button>)
        }
        
        {/* Terminal toggle button */}
        <button
          onClick={() => {
            setTerminalVisible(!terminalVisible);
            setTerminalHeight(250);
          }}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 flex items-center justify-center shadow-md"
        >
          <FaTerminal className="text-lg" />
        </button>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLanguageDropdownVisible(!isLanguageDropdownVisible)}
            className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 flex items-center justify-center shadow-md sm:hidden"
          >
            <FaLanguage />
          </button>
          <select
            className={`px-2 py-1 bg-gray-800 text-white rounded shadow-md focus:ring focus:ring-blue-500 ${
              isLanguageDropdownVisible ? "block" : "hidden sm:block"
            }`}
            value={language}
            onChange={handleLanguageChange}
          >
            {LANGUAGE_DATA.map((lang, index) => (
              <option key={index} value={lang.language}>
                {lang.language.toUpperCase()} (v{lang.version})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownVisible(!isThemeDropdownVisible)}
            className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 flex items-center justify-center shadow-md sm:hidden"
          >
            <FaPalette />
          </button>
          <select
            className={`px-2 py-1 bg-gray-800 text-white rounded shadow-md focus:ring focus:ring-blue-500 ${
              isThemeDropdownVisible ? "block" : "hidden sm:block"
            }`}
            value={theme}
            onChange={handleThemeChange}
          >
            {Object.keys(themes).map((themeKey, index) => (
              <option key={index} value={themeKey}>
                {themeKey}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Line wrapping toggle button */}
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded shadow-md flex items-center space-x-1 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
          onClick={handleLineWrapping}
        >
          <FaCode />
          <span className="hidden sm:inline">{isLineWrapping ? "Disable Wrapping" : "Enable Wrapping"}</span>
        </button>

        {/* Run code button */}
        <button
          className={`px-3 py-1 ${loading ? "bg-green-700" : "bg-green-500"} text-white rounded shadow-md flex items-center space-x-1 hover:bg-green-400 focus:outline-none focus:ring focus:ring-green-300`}
          onClick={runCode}
          disabled={loading}
        >
          <FaPlay />
          <span className="hidden md:inline ">{loading ? "Running..." : "Run Code"}</span>
        </button>
      </div>
    </div>
  );
}