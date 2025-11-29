import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadSection from "./components/UploadSection";
import ModelSelector from "./components/ModelSelector";
import ImagePreprocessor from "./components/ImagePreprocessor";
import AdvancedOptions from "./components/AdvancedOptions";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState("ensemble");
  const [availableModels, setAvailableModels] = useState({ deit3: false, vit: false });
  const [preprocessSettings, setPreprocessSettings] = useState({
    brightness: 1.0,
    contrast: 1.0,
    rotation: 0,
    flip_h: false,
    flip_v: false,
    enhance: false,
    sharpen: false,
  });
  const [advancedOptions, setAdvancedOptions] = useState({
    use_multilayer: false,
    use_attention_rollout: false,
    use_uncertainty: true,
    generate_mask: false,
  });
  const [heatmapSettings, setHeatmapSettings] = useState({
    alpha: 0.4,
    smooth: true,
    sigma: 2.0,
    colormap: "jet",
    show_contours: true,
    contour_threshold: 0.7,
  });

  // Check available models on mount
  useEffect(() => {
    checkModels();
  }, []);

  const checkModels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/health`);
      setAvailableModels({
        deit3: res.data.deit3_available || false,
        vit: res.data.vit_available || false,
      });
    } catch (err) {
      console.error("Error checking models:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreprocess = (settings) => {
    setPreprocessSettings(settings);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("model", selectedModel);
    formData.append("use_multilayer", advancedOptions.use_multilayer);
    formData.append("use_attention_rollout", advancedOptions.use_attention_rollout);
    formData.append("use_uncertainty", advancedOptions.use_uncertainty);
    formData.append("generate_mask", advancedOptions.generate_mask);
    formData.append("brightness", preprocessSettings.brightness);
    formData.append("contrast", preprocessSettings.contrast);
    formData.append("rotation", preprocessSettings.rotation);
    formData.append("flip_h", preprocessSettings.flip_h);
    formData.append("flip_v", preprocessSettings.flip_v);
    formData.append("enhance", preprocessSettings.enhance);
    formData.append("sharpen", preprocessSettings.sharpen);
    formData.append("heatmap_alpha", heatmapSettings.alpha);
    formData.append("heatmap_smooth", heatmapSettings.smooth);
    formData.append("heatmap_sigma", heatmapSettings.sigma);
    formData.append("heatmap_colormap", heatmapSettings.colormap);
    formData.append("show_contours", heatmapSettings.show_contours);
    formData.append("contour_threshold", heatmapSettings.contour_threshold);

    try {
      const res = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      setResult(res.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Server error occurred");
      } else if (err.request) {
        setError("Unable to connect to server. Please ensure the backend is running.");
      } else {
        setError("Error: " + err.message);
      }
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setPreprocessSettings({
      brightness: 1.0,
      contrast: 1.0,
      rotation: 0,
      flip_h: false,
      flip_v: false,
      enhance: false,
      sharpen: false,
    });
  };

  const handleGenerateReport = async () => {
    if (!result) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/generate-report`,
        result,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "diagnosis_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Failed to generate PDF report: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10 animate-fade-in">
        <div className="inline-block mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg transform rotate-6 hover:rotate-12 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold gradient-text">
              GI Endoscopy AI
            </h1>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg transform -rotate-6 hover:-rotate-12 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
          Advanced AI-powered gastrointestinal endoscopy analysis with explainable AI
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Powered by Vision Transformer Ensemble
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-6xl relative z-10 animate-slide-up space-y-6">
        {/* Model Selection */}
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          availableModels={availableModels}
        />

        {/* Main Content Card */}
        <div className="glass rounded-3xl shadow-2xl p-6 md:p-10 border border-white/30 backdrop-blur-xl">
          <UploadSection
            selectedFile={selectedFile}
            preview={preview}
            result={result}
            loading={loading}
            error={error}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            onReset={handleReset}
            onGenerateReport={handleGenerateReport}
            preprocessSettings={preprocessSettings}
            onPreprocessChange={handlePreprocess}
            advancedOptions={advancedOptions}
            onAdvancedOptionsChange={setAdvancedOptions}
            heatmapSettings={heatmapSettings}
            onHeatmapSettingsChange={setHeatmapSettings}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500 relative z-10 animate-fade-in">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Fast Inference</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Medical-Grade Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Grad-CAM Explainability</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
