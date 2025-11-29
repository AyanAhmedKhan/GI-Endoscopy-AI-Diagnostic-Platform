import React, { useState } from "react";

const ImagePreprocessor = ({ image, onPreprocess, onReset }) => {
  const [settings, setSettings] = useState({
    brightness: 1.0,
    contrast: 1.0,
    rotation: 0,
    flip_h: false,
    flip_v: false,
    enhance: false,
    sharpen: false,
  });

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onPreprocess(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      brightness: 1.0,
      contrast: 1.0,
      rotation: 0,
      flip_h: false,
      flip_v: false,
      enhance: false,
      sharpen: false,
    };
    setSettings(defaultSettings);
    onPreprocess(defaultSettings);
  };

  if (!image) return null;

  return (
    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Image Preprocessing
        </h3>
        <button
          onClick={resetSettings}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brightness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brightness: {settings.brightness.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.brightness}
            onChange={(e) => handleChange("brightness", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Contrast */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contrast: {settings.contrast.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.contrast}
            onChange={(e) => handleChange("contrast", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rotation: {settings.rotation}°
          </label>
          <div className="flex gap-2">
            <input
              type="range"
              min="-180"
              max="180"
              step="15"
              value={settings.rotation}
              onChange={(e) => handleChange("rotation", parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="flex gap-1">
              <button
                onClick={() => handleChange("rotation", settings.rotation - 90)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                -90°
              </button>
              <button
                onClick={() => handleChange("rotation", settings.rotation + 90)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                +90°
              </button>
            </div>
          </div>
        </div>

        {/* Flip */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Flip</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange("flip_h", !settings.flip_h)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                settings.flip_h
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Horizontal
            </button>
            <button
              onClick={() => handleChange("flip_v", !settings.flip_v)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                settings.flip_v
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Vertical
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange("enhance", !settings.enhance)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                settings.enhance
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Enhance Edges
            </button>
            <button
              onClick={() => handleChange("sharpen", !settings.sharpen)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                settings.sharpen
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sharpen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreprocessor;

