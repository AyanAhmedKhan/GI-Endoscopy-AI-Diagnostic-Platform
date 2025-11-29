import React from "react";

const AdvancedOptions = ({ options, onChange }) => {
  const toggleOption = (key) => {
    onChange({ ...options, [key]: !options[key] });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Advanced Options
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={options.use_multilayer || false}
            onChange={() => toggleOption("use_multilayer")}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <div className="font-semibold text-gray-800">Multi-Layer Grad-CAM</div>
            <div className="text-xs text-gray-600">Combine heatmaps from multiple layers</div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={options.use_attention_rollout || false}
            onChange={() => toggleOption("use_attention_rollout")}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <div className="font-semibold text-gray-800">Attention Rollout</div>
            <div className="text-xs text-gray-600">ViT attention visualization</div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={options.use_uncertainty !== false}
            onChange={() => toggleOption("use_uncertainty")}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <div className="font-semibold text-gray-800">Uncertainty Estimation</div>
            <div className="text-xs text-gray-600">Monte Carlo Dropout analysis</div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={options.generate_mask || false}
            onChange={() => toggleOption("generate_mask")}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <div className="font-semibold text-gray-800">Lesion Localization Mask</div>
            <div className="text-xs text-gray-600">Enhanced binary mask with smoothing & morphology</div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AdvancedOptions;

