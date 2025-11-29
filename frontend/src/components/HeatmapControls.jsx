import React from "react";

const HeatmapControls = ({ settings, onChange }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        Heatmap Visualization Controls
      </h3>
      
      <div className="space-y-4">
        {/* Opacity Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Opacity: {Math.round(settings.alpha * 100)}%
            </label>
            <span className="text-xs text-gray-500">Original ↔ Heatmap</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.alpha}
            onChange={(e) => onChange({ ...settings, alpha: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Original</span>
            <span>Heatmap</span>
          </div>
        </div>

        {/* Colormap Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colormap
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['jet', 'plasma', 'magma'].map((cmap) => (
              <button
                key={cmap}
                onClick={() => onChange({ ...settings, colormap: cmap })}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  settings.colormap === cmap
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cmap.charAt(0).toUpperCase() + cmap.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Smoothing Toggle */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div>
            <div className="font-semibold text-gray-800 text-sm">Gaussian Smoothing</div>
            <div className="text-xs text-gray-600">Smooth patch attention for continuous heatmap</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smooth}
              onChange={(e) => onChange({ ...settings, smooth: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {/* Smoothing Sigma */}
        {settings.smooth && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Smoothing Intensity: {settings.sigma.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={settings.sigma}
              onChange={(e) => onChange({ ...settings, sigma: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        )}

        {/* Contour Toggle */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div>
            <div className="font-semibold text-gray-800 text-sm">Top-Attention Contours</div>
            <div className="text-xs text-gray-600">Highlight high-attention regions with yellow contours</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_contours}
              onChange={(e) => onChange({ ...settings, show_contours: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {/* Contour Threshold */}
        {settings.show_contours && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contour Threshold: {settings.contour_threshold.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.05"
              value={settings.contour_threshold}
              onChange={(e) => onChange({ ...settings, contour_threshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>More regions</span>
              <span>Top regions only</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapControls;

