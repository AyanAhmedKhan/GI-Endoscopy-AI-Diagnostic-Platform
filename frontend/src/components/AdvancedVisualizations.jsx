import React, { useState } from "react";

const AdvancedVisualizations = ({ result, originalImage }) => {
  const [viewMode, setViewMode] = useState("comparative");
  const [blendAlpha, setBlendAlpha] = useState(0.5);
  const [maskThreshold, setMaskThreshold] = useState(0.5);

  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-4 rounded-xl">
        <button
          onClick={() => setViewMode("comparative")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            viewMode === "comparative"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Comparative View
        </button>
        <button
          onClick={() => setViewMode("multilayer")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            viewMode === "multilayer"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          disabled={!result.multilayer_gradcam}
        >
          Multi-Layer Grad-CAM
        </button>
        <button
          onClick={() => setViewMode("attention")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            viewMode === "attention"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          disabled={!result.attention_rollout_base64}
        >
          Attention Rollout
        </button>
        <button
          onClick={() => setViewMode("mask")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            viewMode === "mask"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          disabled={!result.mask_base64}
        >
          Lesion Mask
        </button>
      </div>

      {/* Comparative View */}
      {viewMode === "comparative" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Comparative View</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">Blend: {blendAlpha.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={blendAlpha}
                onChange={(e) => setBlendAlpha(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-700 mb-2">Original</h4>
              {originalImage && (
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full rounded-lg shadow-lg border-2 border-gray-200"
                />
              )}
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-700 mb-2">Grad-CAM Heatmap</h4>
              {result.gradcam_base64 && (
                <img
                  src={`data:image/png;base64,${result.gradcam_base64}`}
                  alt="Grad-CAM"
                  className="w-full rounded-lg shadow-lg border-2 border-blue-200"
                />
              )}
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-700 mb-2">Mask Overlay</h4>
              {result.mask_base64 && (
                <img
                  src={`data:image/png;base64,${result.mask_base64}`}
                  alt="Mask"
                  className="w-full rounded-lg shadow-lg border-2 border-red-200"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Layer Grad-CAM */}
      {viewMode === "multilayer" && result.multilayer_gradcam && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Multi-Layer Grad-CAM</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(result.multilayer_gradcam).map(([layer, base64]) => (
              <div key={layer} className="text-center">
                <h4 className="font-semibold text-gray-700 mb-2 capitalize">{layer} Layer</h4>
                <img
                  src={`data:image/png;base64,${base64}`}
                  alt={`${layer} layer`}
                  className="w-full rounded-lg shadow-lg border-2 border-purple-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attention Rollout */}
      {viewMode === "attention" && result.attention_rollout_base64 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Attention Rollout Visualization</h3>
          <p className="text-sm text-gray-600">
            Shows region-to-region attention patterns in the Vision Transformer
          </p>
          <div className="flex justify-center">
            <img
              src={`data:image/png;base64,${result.attention_rollout_base64}`}
              alt="Attention Rollout"
              className="max-w-full rounded-lg shadow-2xl border-4 border-indigo-200"
            />
          </div>
        </div>
      )}

      {/* Lesion Mask */}
      {viewMode === "mask" && result.mask_base64 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Professional Lesion Localization</h3>
              <p className="text-sm text-gray-600 mt-1">
                Medical-grade visualization with contour boundaries and smooth overlay
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1 text-gray-800">Professional Features:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Optimized threshold (0.35) for accurate detection</li>
                  <li>Advanced Gaussian smoothing to remove artifacts</li>
                  <li>Morphological filtering and noise removal</li>
                  <li>Contour boundaries for precise lesion localization</li>
                  <li>Smooth alpha-blended red overlay (medical standard)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Lesion Overlay Visualization
              </h4>
              <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden">
                <img
                  src={`data:image/png;base64,${result.mask_base64}`}
                  alt="Professional Lesion Mask"
                  className="w-full h-auto"
                />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500/40 rounded"></span>
                  <span>Red overlay: Lesion regions</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-cyan-400 rounded"></span>
                  <span>Cyan contour: Boundaries</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Side-by-Side Comparison
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">Original</div>
                  {originalImage && (
                    <img
                      src={originalImage}
                      alt="Original Image"
                      className="w-full h-auto"
                    />
                  )}
                </div>
                <div className="bg-white rounded-lg shadow-md border-2 border-red-200 overflow-hidden">
                  <div className="bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">With Lesion Markers</div>
                  <img
                    src={`data:image/png;base64,${result.mask_base64}`}
                    alt="Lesion Marked"
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-gray-700">
                  <strong className="text-blue-800">Medical Standard:</strong> Red semi-transparent overlay indicates 
                  detected lesion regions. Cyan contour lines mark precise boundaries for clinical assessment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedVisualizations;

