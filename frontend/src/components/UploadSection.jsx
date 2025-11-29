import React, { useState } from "react";
import ImagePreprocessor from "./ImagePreprocessor";
import AdvancedOptions from "./AdvancedOptions";
import AdvancedVisualizations from "./AdvancedVisualizations";
import HeatmapControls from "./HeatmapControls";

const UploadSection = ({
  selectedFile,
  preview,
  result,
  loading,
  error,
  onFileChange,
  onUpload,
  onReset,
  onGenerateReport,
  preprocessSettings,
  onPreprocessChange,
  advancedOptions,
  onAdvancedOptionsChange,
  heatmapSettings,
  onHeatmapSettingsChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-orange-400 transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative p-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {selectedFile ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedFile.name}
                  </span>
                ) : (
                  "Click to upload endoscopy image"
                )}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, JPEG up to 10MB
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="flex justify-center animate-scale-in">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-80 rounded-xl shadow-2xl border-4 border-white transform group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-lg">
                Preview
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preprocessing */}
      {preview && (
        <div className="animate-slide-up">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {showAdvanced ? "Hide" : "Show"} Advanced Options
            <svg className={`w-5 h-5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="space-y-4 animate-slide-down">
              <ImagePreprocessor
                image={preview}
                onPreprocess={onPreprocessChange}
                onReset={() => onPreprocessChange({
                  brightness: 1.0,
                  contrast: 1.0,
                  rotation: 0,
                  flip_h: false,
                  flip_v: false,
                  enhance: false,
                  sharpen: false,
                })}
              />
              <AdvancedOptions
                options={advancedOptions}
                onChange={onAdvancedOptionsChange}
              />
              <HeatmapControls
                settings={heatmapSettings}
                onChange={onHeatmapSettingsChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={onUpload}
          disabled={loading || !selectedFile}
          className="group relative px-10 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-3">
            {loading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Upload & Diagnose</span>
              </>
            )}
          </span>
        </button>

        {(selectedFile || result) && (
          <button
            onClick={onReset}
            disabled={loading}
            className="px-10 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </span>
          </button>
        )}

        {result && onGenerateReport && (
          <button
            onClick={onGenerateReport}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate PDF Report
            </span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="animate-slide-down">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="mt-10 space-y-8 border-t border-gray-200 pt-8 animate-fade-in">
          {/* Main Prediction Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border border-blue-200/50 shadow-xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Diagnosis Result
                </h2>
              </div>
              <div className="text-center space-y-4">
                <div>
                  <p className="text-lg text-gray-600 mb-3 font-medium">Predicted Condition</p>
                  <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent capitalize">
                    {result.predicted_class.replace(/-/g, " ")}
                  </p>
                </div>
                <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-lg border-2 border-orange-200">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Confidence Score</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                      {result.confidence}%
                    </p>
                    {result.confidence >= 90 && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                </div>

                {/* Uncertainty Display */}
                {result.uncertainty && (
                  <div className="mt-4 bg-white/80 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Uncertainty Analysis</p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Score: </span>
                        <span className="font-bold text-purple-600">
                          {(result.uncertainty.uncertainty_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Entropy: </span>
                        <span className="font-bold text-blue-600">
                          {result.uncertainty.entropy.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Model Metrics */}
                {result.model_metrics && (
                  <div className="mt-4 bg-white/80 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Model Performance</p>
                    <div className="space-y-2">
                      {Object.entries(result.model_metrics).map(([model, metrics]) => (
                        <div key={model} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-700 capitalize">{model}:</span>
                          <span className="text-gray-600">
                            {metrics.predicted_class.replace(/-/g, " ")} ({metrics.confidence}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Visualizations */}
          <AdvancedVisualizations result={result} originalImage={preview} />

          {/* Standard Grad-CAM */}
          {result.gradcam_base64 && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      AI Attention Heatmap (Grad-CAM)
                    </h3>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative group/image">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-30 group-hover/image:opacity-50 transition duration-300"></div>
                    <img
                      src={`data:image/png;base64,${result.gradcam_base64}`}
                      alt="GradCAM Heatmap"
                      className="relative rounded-xl shadow-2xl max-w-full h-auto border-4 border-white transform group-hover/image:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Predictions */}
          <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Top 3 Predictions
              </h3>
            </div>
            <div className="space-y-4">
              {result.top3.map((pred, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-xl p-5 transition-all duration-300 ${
                    idx === 0
                      ? "bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 shadow-lg transform hover:scale-[1.02]"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-md ${
                        idx === 0
                          ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-gray-800 capitalize truncate">
                          {pred.class.replace(/-/g, " ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {idx === 0 ? "Primary Diagnosis" : "Alternative Diagnosis"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="w-40 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            idx === 0
                              ? "bg-gradient-to-r from-orange-500 to-red-500"
                              : "bg-gradient-to-r from-gray-400 to-gray-500"
                          }`}
                          style={{ width: `${pred.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-lg font-bold w-20 text-right ${
                        idx === 0 ? "text-orange-600" : "text-gray-600"
                      }`}>
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inference Time & Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  Inference: <span className="font-bold text-gray-800">{result.inference_time}s</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">Model: {result.model_used}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">High Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
