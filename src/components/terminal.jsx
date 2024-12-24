import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput } from "../store/apiResponseSlice";
import { Rnd } from "react-rnd";
import Split from "react-split";
import { FaTimes } from "react-icons/fa";

export default function InputOutputTerminal({ terminalHeight, setTerminalHeight, setTerminalVisible }) {
  const dispatch = useDispatch();
  const { input, output, code } = useSelector((state) => state.response);

  const handleInputChange = (e) => {
    dispatch(setInput(e.target.value));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(setInput(event.target.result));
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(setInput(event.target.result));
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCloseTerminal = () => {
    setTerminalVisible(false);
  };

  return (
    <Rnd
      size={{ height: terminalHeight, width: "100%" }}
      maxHeight={735}
      minHeight={100}
      position={{ x: 0, y: window.innerHeight - terminalHeight-0.5 }}
      onResizeStop={(e, direction, ref) => {
        setTerminalHeight(ref.offsetHeight);
      }}
      className="bg-gray-900 border-t border-gray-700 text-gray-400 flex flex-col absolute bottom-0"
      enableResizing={{ top: true }}
      disableDragging={true}
    >
      {/* Resizable horizontal split between Input and Output */}
      <Split
        className="flex flex-row h-full"
        sizes={[50, 50]} // Default 50-50 split
        minSize={375} // Minimum size for each section
        gutterSize={10} // Space for the draggable gutter
        gutterAlign="center"
        snapOffset={0}
        direction="horizontal"
        cursor="col-resize"
        style={{ display: "flex" }}
      >
        {/* Input Section */}
        <div className="bg-gray-800 p-3 rounded text-sm overflow-auto flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Input</h3>
            <input
              type="file"
              className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
              onChange={handleFileUpload}
            />
          </div>
          <textarea
            className="flex-1 bg-gray-700 text-gray-200 p-2 rounded resize-none"
            value={input}
            onChange={handleInputChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            placeholder="Enter input here, drag and drop a file, or upload a file"
          ></textarea>
        </div>

        {/* Output Section */}
        <div
          className={`bg-gray-800 p-3 rounded text-sm overflow-auto flex flex-col border-l-4 border-gray-400 ${
            code === 0 ? "border-green-500" : ""
          }
          ${
            code === 1 ? "border-red-500":""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Output</h3>
            <button
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={handleCloseTerminal}
              title="Close Terminal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div
            className={`flex-1 bg-gray-700 p-2 rounded text-sm overflow-auto text-gray-200 ${
              code === 0 ? "text-green-400" : ""
            }${
              code === 1 ? "text-red-400":""
            }`}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {output || "Output will be shown here."}
          </div>
        </div>
      </Split>
    </Rnd>
  );
}
