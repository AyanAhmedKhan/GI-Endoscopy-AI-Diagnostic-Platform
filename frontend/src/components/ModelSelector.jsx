import React from "react";

const ModelSelector = ({ selectedModel, onModelChange, availableModels }) => {
  const models = [
    { id: "ensemble", name: "Ensemble", description: "Combines DeiT3 + ViT for best accuracy", icon: "🎯" },
    { id: "deit3", name: "DeiT3", description: "Data-efficient Image Transformer", icon: "🔬" },
    { id: "vit", name: "ViT", description: "Vision Transformer", icon: "👁️" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Select AI Model
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => {
          const isAvailable = model.id === "ensemble" || availableModels[model.id];
          return (
            <button
              key={model.id}
              onClick={() => isAvailable && onModelChange(model.id)}
              disabled={!isAvailable}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform ${
                selectedModel === model.id
                  ? "border-blue-500 bg-blue-100 shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              } ${!isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {selectedModel === model.id && (
                <div className="absolute top-2 right-2">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="text-3xl mb-2">{model.icon}</div>
              <div className="font-bold text-gray-800 mb-1">{model.name}</div>
              <div className="text-xs text-gray-600">{model.description}</div>
              {!isAvailable && (
                <div className="text-xs text-red-500 mt-2">Not available</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModelSelector;

