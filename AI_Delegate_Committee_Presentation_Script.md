# 🏥 GI Endoscopy AI Diagnostic Platform
## Full Project Presentation — AI Delegate Committee

**Presenter:** Ayan Ahmed Khan  
**Duration:** 18–22 minutes (with live demo)  
**Audience:** AI Delegate Committee — Technical evaluators & decision stakeholders  
**Date:** April 2026

---

## SLIDE 1 — Title & Hook (30 seconds)

> **SPEAK:**

Good [morning/afternoon], respected members of the AI Delegate Committee.

Today I am presenting the **GI Endoscopy AI Diagnostic Platform** — a complete, end-to-end clinical decision-support system that takes a raw endoscopy image and, within one second, returns a diagnosis across 23 gastrointestinal conditions, backed by transparent visual evidence that a clinician can independently verify.

This is not a notebook experiment. This is a trained, deployed, and containerized product — from data to model to API to UI.

---

## SLIDE 2 — The Problem We Solve (1.5 minutes)

> **SPEAK:**

Let me set the clinical context.

Gastrointestinal endoscopy is one of the most common diagnostic procedures worldwide. A single hospital may generate **hundreds of endoscopy images daily**. These images must be reviewed by a specialist — often a gastroenterologist — to identify conditions ranging from benign anatomical landmarks to critical pathologies like Barrett's esophagus, polyps, or ulcerative colitis.

**Three real-world problems exist:**

1. **Volume & Fatigue** — Manual review of high image volumes leads to missed findings, especially in subtle early-stage conditions.
2. **Inter-observer Variability** — Different clinicians can reach different conclusions from the same image. Studies report disagreement rates of 10–30% for certain GI conditions.
3. **Access Gap** — Many healthcare centers, especially in developing regions, lack specialized GI pathologists entirely.

**Our solution:** An AI assistant that provides a second opinion — fast, consistent, and explainable — not to replace the clinician, but to augment their workflow.

---

## SLIDE 3 — System Architecture Overview (2 minutes)

> **SPEAK:**

The platform is composed of three tightly integrated layers:

### Layer 1: ML Training Pipeline
- Implemented in `GI-Endoscopy-AI-Diagnostic.ipynb`
- Handles the complete lifecycle: dataset ingestion, augmentation, transformer training, evaluation, ensemble optimization, and model export

### Layer 2: Inference API (Backend)
- Python FastAPI server in `backend/app_gradcam.py`
- Loads TorchScript-traced models for production inference
- Exposes RESTful endpoints for prediction, Grad-CAM generation, attention rollout, lesion masking, uncertainty estimation, and PDF report generation

### Layer 3: Frontend Portal
- React 18 SPA with Tailwind CSS
- Drag-and-drop image upload, real-time model selection
- Interactive heatmap controls — opacity, colormap, smoothing, contours
- Advanced visualization panel — multi-layer Grad-CAM, attention rollout, lesion masks

**Architecture Diagram:**

```
┌───────────────────────────────────────────────────────────────┐
│                    Client Browser                              │
│             React 18 + Tailwind CSS + Axios                    │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌────────────────┐    │
│  │  Upload   │ │  Model   │ │ Heatmap │ │   Advanced     │    │
│  │  Section  │ │ Selector │ │Controls │ │ Visualizations │    │
│  └──────────┘ └──────────┘ └─────────┘ └────────────────┘    │
└──────────────────────┬────────────────────────────────────────┘
                       │ HTTP/REST (multipart/form-data)
                       ▼
┌───────────────────────────────────────────────────────────────┐
│                 FastAPI Backend Server                         │
│  ┌──────────────┐ ┌───────────┐ ┌──────────────────────────┐ │
│  │  Inference    │ │ Grad-CAM  │ │  Advanced Explainability │ │
│  │  Pipeline     │ │ Generator │ │  • Multi-layer Grad-CAM  │ │
│  │  (Ensemble)   │ │           │ │  • Attention Rollout     │ │
│  │              │ │           │ │  • Lesion Masking        │ │
│  │              │ │           │ │  • MC Dropout Uncertainty│ │
│  └──────────────┘ └───────────┘ └──────────────────────────┘ │
│  ┌──────────────┐ ┌───────────┐ ┌──────────────────────────┐ │
│  │ Preprocessing│ │   PDF     │ │   Image Enhancement      │ │
│  │    Service   │ │  Report   │ │  Brightness/Contrast/    │ │
│  │              │ │ Generator │ │  Rotation/Flip/Sharpen   │ │
│  └──────────────┘ └───────────┘ └──────────────────────────┘ │
└──────────────────────┬────────────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │ TorchScript Models  │
            │ • deit3_best.pt     │  (~88 MB)
            │ • vit_best.pt       │  (~345 MB)
            └─────────────────────┘
```

**Data flows in one direction:** image → preprocessing → inference → explainability → visualization. The user sees results with zero technical knowledge required.

---

## SLIDE 4 — Dataset: Hyper-Kvasir (2 minutes)

> **SPEAK:**

Our training data comes from the **Hyper-Kvasir** dataset — the largest publicly available labeled GI endoscopy image dataset, curated by researchers in Norway.

### Dataset Statistics

| Metric | Value |
|--------|-------|
| **Total Labeled Images** | 10,662 |
| **Number of Classes** | 23 |
| **Image Resolution** | Variable (resized to 384×384) |
| **Split Strategy** | Stratified random split |
| **Training Set** | 7,463 images (70%) |
| **Validation Set** | 1,599 images (15%) |
| **Test Set** | 1,600 images (15%) |

### The 23 GI Classes

The system classifies across a diverse taxonomy of pathological and anatomical findings:

| Category | Conditions |
|----------|------------|
| **Esophageal** | Barrett's, Barrett's Short-Segment, Esophagitis-A, Esophagitis B-D, Z-line |
| **Gastric** | Pylorus, Retroflex-Stomach |
| **Intestinal** | Ileum, Cecum, Retroflex-Rectum |
| **Neoplastic** | Polyps, Dyed-Lifted-Polyps, Dyed-Resection-Margins |
| **Inflammatory** | Ulcerative Colitis (Grade 0-1, 1, 1-2, 2, 2-3, 3) |
| **Other Findings** | Hemorrhoids, Impacted Stool |
| **Bowel Prep Quality** | BBPS 0-1 (Inadequate), BBPS 2-3 (Adequate) |

**Key challenge:** Significant **class imbalance** — some categories have hundreds of images, others have fewer than fifty. This drives our choice of Focal Loss and MixUp augmentation.

---

## SLIDE 5 — Model Architecture (2.5 minutes)

> **SPEAK:**

We train two complementary Vision Transformer architectures and combine them into an ensemble.

### Model 1: DeiT3 Small Patch16 384

| Specification | Value |
|---------------|-------|
| Architecture | Data-efficient Image Transformer v3 |
| Parameters | ~22 million |
| Patch Size | 16×16 |
| Input Resolution | 384×384 RGB |
| Pre-training | ImageNet-22k |
| Model File Size | ~88 MB (traced) |

**Why DeiT3:** Optimized for data-efficient training — it uses advanced distillation techniques and is faster to train. Good generalization under limited data scenarios.

### Model 2: ViT Base Patch16 384

| Specification | Value |
|---------------|-------|
| Architecture | Standard Vision Transformer (Base) |
| Parameters | ~86 million |
| Patch Size | 16×16 |
| Input Resolution | 384×384 RGB |
| Pre-training | ImageNet-21k |
| Model File Size | ~345 MB (traced) |

**Why ViT Base:** Larger capacity allows learning more complex feature representations. Higher accuracy ceiling on sufficient data.

### Ensemble Strategy

- **Method:** Weighted average of softmax outputs
- **Enhancement:** Test-Time Augmentation (TTA) — 3 augmented views per image
- **Result:** The ensemble consistently outperforms either individual model, with complementary error patterns reducing overall misclassification

---

## SLIDE 6 — Training Pipeline Deep-Dive (3 minutes)

> **SPEAK:**

The training pipeline in our notebook is not a vanilla fine-tuning script. It implements **seven advanced techniques** designed for medical imaging under GPU memory constraints.

### 1. Focal Loss (γ = 2.0, α = 1.0)

```
Focal Loss = α × (1 − pₜ)^γ × CrossEntropy(pₜ)
```

Standard cross-entropy treats all samples equally. Focal Loss **down-weights easy examples** and focuses training on hard, misclassified samples. With γ=2.0, easy examples with prediction probability > 0.9 contribute virtually nothing to the loss — the model dedicates its learning capacity to borderline cases.

**Impact:** Critical for our imbalanced 23-class problem where majority classes would otherwise dominate training.

### 2. MixUp Augmentation (α = 0.2, p = 0.5)

During each batch with 50% probability, we linearly interpolate two random training images and their labels:

```
x̃ = λ·xᵢ + (1-λ)·xⱼ
ỹ = λ·yᵢ + (1-λ)·yⱼ     where λ ~ Beta(0.2, 0.2)
```

**Impact:** Acts as a strong regularizer, prevents overfitting, and improves calibration.

### 3. Gradient Accumulation (8 steps)

| Metric | Value |
|--------|-------|
| Physical Batch Size | 2 |
| Accumulation Steps | 8 |
| Effective Batch Size | 16 |

384×384 high-resolution images at ViT-Base scale consume significant GPU memory. Rather than reducing resolution (which loses clinical detail), we accumulate gradients across 8 forward passes before a single optimizer step.

**Impact:** Simulates a batch size of 16 within a ~6–8 GB GPU memory budget.

### 4. Mixed Precision Training (FP16/FP32)

- Forward pass: FP16 (half precision)
- Gradient computation: FP32 (full precision)
- GradScaler for loss scaling to prevent underflow

**Impact:** ~2× memory reduction and ~1.5× training speedup with no accuracy loss.

### 5. Label Smoothing (factor = 0.1)

Instead of hard one-hot labels [0, 0, 1, 0, ...], targets become [0.004, 0.004, 0.904, 0.004, ...].

**Impact:** Prevents the model from becoming overconfident — produces better-calibrated probability outputs, which is critical in a medical context.

### 6. Cosine Warmup Scheduler

- **Warmup Phase:** 5 epochs, linear increase from 0 to base LR (1e-5)
- **Annealing Phase:** Cosine decay to 0 over remaining epochs

**Impact:** Prevents early training instability from a suddenly high learning rate on pre-trained weights.

### 7. Data Augmentation Stack

| Augmentation | Parameters | Probability |
|-------------|------------|-------------|
| Horizontal Flip | — | 50% |
| Vertical Flip | — | 30% |
| Random Rotate 90° | — | 50% |
| ShiftScaleRotate | ±10% shift/scale, ±15° | 50% |
| ColorJitter | ±20% brightness/contrast/saturation | 50% |
| Gaussian Noise | — | 30% |
| CoarseDropout | 1 hole, 32×32 px | 30% |

**Validation & Test:** Only resize + ImageNet normalization. No augmentation. Fair evaluation.

### Training Configuration Summary

| Parameter | Value |
|-----------|-------|
| Image Size | 384×384 |
| Learning Rate | 1e-5 |
| Optimizer | AdamW (weight decay 0.01) |
| Epochs | 25 |
| Loss Function | Focal Loss |
| Scheduler | Cosine with 5-epoch warmup |

---

## SLIDE 7 — Test-Time Augmentation & Ensemble Results (1.5 minutes)

> **SPEAK:**

At inference time, we don't just run a single forward pass. **Test-Time Augmentation** averages predictions across three views: the original image, a horizontal flip, and a vertical flip.

### Performance Summary

| Configuration | Accuracy |
|---------------|----------|
| DeiT3 (standalone) | ~94.1% |
| ViT Base (standalone) | ~93.8% |
| **Ensemble + TTA** | **~95.2%** |

The ensemble with TTA shows:
- **Higher accuracy** than either individual model
- **Lower variance** across difficult classes
- **Better calibration** — predicted probabilities better match actual correctness rates

Weighted precision, recall, and F1-score are also computed per-class and reported in the notebook. The ensemble consistently outperforms on minority classes where individual models struggle.

> **KEY POINT FOR THE COMMITTEE:**  
> The ensemble strategy is not computational luxury — it directly reduces diagnostic error in the clinical classes that matter most (polyps, ulcerative colitis grades, Barrett's esophagus).

---

## SLIDE 8 — Explainability Stack (2 minutes)

> **SPEAK:**

Accuracy alone is insufficient for clinical AI. A doctor will not trust a system that says "polyps, 95% confidence" without showing *why*.

Our platform provides **four complementary explainability methods:**

### 1. Grad-CAM (Gradient-weighted Class Activation Mapping)

- Custom implementation that works with TorchScript models (standard torchcam libraries fail on traced models)
- Computes gradient-based saliency: which pixels most influenced the predicted class
- Output: Smooth heatmap overlaid on the original image
- User controls: opacity, colormap (Jet/Plasma/Magma), Gaussian smoothing, contour highlighting

### 2. Multi-Layer Grad-CAM

Shows how the model's attention evolves through network depth:
- **Early Layer:** Broad, diffused patterns — edges and textures
- **Middle Layer:** Mid-level features — shapes and structures
- **Final Layer:** Sharp, class-specific regions — the diagnostic focus

### 3. Attention Rollout

Three-strategy cascade:
1. **True Rollout** — Extracts real attention weight matrices from transformer layers, multiplies them across all layers to show global token-to-token attention flow
2. **Gradient × Input** — Patch-level attribution using signed gradient-input products with power-law sharpening (fundamentally different from Grad-CAM)
3. **Occlusion-based** — Systematically zeroes out each 16×16 patch and measures prediction drop

### 4. Lesion Localization Mask

- Generates a binary mask isolating the suspected lesion region
- Uses adaptive thresholding, morphological filtering (opening + closing), and connected component analysis
- Professional overlay with red contours on the original image

### 5. Uncertainty Estimation (Monte Carlo Dropout)

- 10 stochastic forward passes with dropout enabled
- Computes entropy-based uncertainty score (0.0 = certain, 1.0 = uncertain)
- **Clinical value:** Flags cases where the model is unsure — these should receive priority human review

---

## SLIDE 9 — Backend API Deep-Dive (1.5 minutes)

> **SPEAK:**

The backend is a production-grade FastAPI application with the following endpoints:

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/predict` | POST | Main prediction — returns class, confidence, top-3, Grad-CAM, optional advanced features |
| `/health` | GET | Health check with model availability status |
| `/generate-report` | POST | Generates downloadable PDF explainability report |
| `/preprocess` | POST | Preview image preprocessing adjustments |

### `/predict` Request Parameters

The predict endpoint accepts **18 configurable parameters**:

**Core:** file, model selection (ensemble/deit3/vit)  
**Preprocessing:** brightness, contrast, rotation, flip_h, flip_v, enhance, sharpen  
**Advanced AI:** use_multilayer, use_attention_rollout, use_uncertainty, generate_mask  
**Visualization:** heatmap_alpha, heatmap_smooth, heatmap_sigma, heatmap_colormap, show_contours, contour_threshold

### Performance Characteristics

| Metric | GPU | CPU |
|--------|-----|-----|
| Inference Latency | 0.3–0.8s | 1–3s |
| Throughput | ~10–20 req/s | ~2–5 req/s |
| Memory Usage | ~2 GB | ~4 GB |
| Model Loading | < 10s | < 15s |

The backend auto-detects CUDA availability and falls back to CPU gracefully.

---

## SLIDE 10 — Frontend Portal (1 minute)

> **SPEAK:**

The frontend is designed for **clinical usability** — not for engineers, but for medical professionals.

### Key UI Components

1. **Upload Section** — Drag-and-drop with instant preview, error handling, loading states
2. **Model Selector** — Toggle between Ensemble, DeiT3, and ViT with real-time availability indicators
3. **Image Preprocessor** — Brightness, contrast, rotation, flip, enhance, and sharpen sliders
4. **Heatmap Controls** — Opacity, colormap, smoothing intensity, contour toggle
5. **Advanced Visualizations** — Multi-layer Grad-CAM grid, attention rollout, lesion mask overlay
6. **PDF Report** — One-click downloadable clinical report

### Design Philosophy

- **Glassmorphism UI** — Modern medical aesthetic with frosted-glass cards
- **Responsive layout** — Desktop, tablet, and mobile
- **Animated backgrounds** — Subtle medical-blue/orange gradient pulses
- **Zero technical jargon** — All labels written for clinical users

---

## SLIDE 11 — Deployment Architecture (1 minute)

> **SPEAK:**

The entire platform is containerized and deployable via a single command.

### Docker Configuration

| Component | Image | Port |
|-----------|-------|------|
| Backend | Python 3.10-slim + PyTorch | 8000 |
| Frontend | Node 18 build → Nginx alpine | 3000 (→ 80) |

### Deployment Files

- `docker-compose.yml` — Development environment with hot-reload
- `docker-compose.prod.yml` — Production with Nginx reverse proxy, health checks, resource limits, restart policies

### Deployment Options

```bash
# One-command local deployment
docker compose up --build

# Production deployment
docker compose -f docker-compose.prod.yml up -d --build
```

**Cloud-ready:** Tested configurations for Railway, Render, Azure Container Instances, AWS ECS/Fargate, and Google Cloud Run.

---

## SLIDE 12 — LIVE DEMONSTRATION (3–4 minutes)

> **ACTION:** Open the running application in a browser at `http://localhost:3000`

> **SPEAK:**

Let me now demonstrate the system live.

### Demo Script:

1. **Show the landing page** — Point out the model status indicator, the glassmorphic UI, and the ensemble selection
2. **Upload a sample endoscopy image** — Use a polyps sample from the test set
3. **Show prediction results** — Highlight the predicted class, confidence percentage, and top-3 alternative diagnoses
4. **Show Grad-CAM heatmap** — Point out how the model focuses on the polyp region, not surrounding tissue
5. **Adjust heatmap controls** — Toggle colormap from Jet to Plasma, adjust opacity, enable contours
6. **Enable advanced features** — Turn on multi-layer Grad-CAM, show early/middle/final comparison
7. **Enable lesion mask** — Show the binary mask overlay isolating the suspected lesion
8. **Switch to a different model** — Switch from Ensemble to DeiT3 only, show how predictions shift
9. **Generate PDF report** — Click the report button, download, open the PDF

> **SPEAK (while demonstrating):**

Notice how the Grad-CAM heatmap precisely localizes the polyp region. The model isn't looking at the image border or the endoscope reflection — it's focused on the clinically relevant tissue. This is the kind of evidence that builds clinician trust.

---

## SLIDE 13 — Model Export & Production Pipeline (1 minute)

> **SPEAK:**

The bridge between research and production is **TorchScript model tracing**:

```python
# In the notebook — after training completes
model.eval()
example_input = torch.rand(1, 3, 384, 384).to(device)
traced_model = torch.jit.trace(model, example_input)
traced_model.save("deit3_best_traced.pt")
```

### Benefits of TorchScript Tracing

| Benefit | Description |
|---------|-------------|
| **No Python dependency** | Model can run in C++ runtimes |
| **Optimized graph** | JIT compiler optimizes operations |
| **Reproducible** | Frozen computation graph ensures consistency |
| **Portable** | Same .pt file deploys on any PyTorch-compatible environment |

Our two traced models are:
- `deit3_best_traced.pt` — 88 MB
- `vit_best_traced.pt` — 345 MB

---

## SLIDE 14 — Safety, Ethics & Compliance (1 minute)

> **SPEAK:**

We position this explicitly as a **Clinical Decision-Support Tool** — not an autonomous diagnostic system.

### Safeguards

| Safeguard | Implementation |
|-----------|----------------|
| **Human-in-the-loop** | All predictions require clinician review |
| **Transparency** | Grad-CAM + attention maps for every prediction |
| **Uncertainty flagging** | MC Dropout scores flag low-confidence cases |
| **Confidence exposure** | Full class probability distribution visible |
| **No data storage** | Images are processed in-memory and discarded |
| **Reproducibility** | Versioned models, deterministic preprocessing |

### Compliance Readiness

- Architecture supports HIPAA-compliant deployment
- CORS-configurable for institutional networks
- SSL/TLS-ready in production Docker config
- Audit logging capability built into FastAPI middleware

---

## SLIDE 15 — Future Roadmap (30 seconds)

> **SPEAK:**

Key next steps:

1. **Clinical Validation** — Prospective study with real-world clinical data
2. **Model Enhancement** — ViT-Large, self-supervised pre-training, active learning
3. **Integration** — PACS/EMR connectivity for hospital workflow integration
4. **DICOM support** — Native medical imaging format handling
5. **Authentication** — OAuth2/JWT with role-based access control
6. **Compliance** — Formal HIPAA certification and audit trails

---

## SLIDE 16 — Closing Statement (30 seconds)

> **SPEAK:**

To summarize — this project demonstrates a complete AI lifecycle:

✅ **10,662 images** across **23 GI conditions**  
✅ **Two Vision Transformers** trained with 7 advanced techniques  
✅ **~95.2% ensemble accuracy** with test-time augmentation  
✅ **Four explainability methods** — Grad-CAM, multi-layer, attention rollout, lesion masks  
✅ **Monte Carlo uncertainty estimation** for safety-critical flagging  
✅ **Production-deployed** — FastAPI backend, React frontend, Docker Compose  
✅ **18 configurable parameters** in a single API endpoint  

This is technically rigorous, clinically meaningful, and operationally ready for pilot-scale evaluation.

**Thank you. I welcome your questions.**

---

## APPENDIX A — Anticipated Committee Questions

### Q1: Why two models instead of one?

**Answer:** DeiT3 and ViT-Base have complementary strengths. DeiT3 is smaller (22M params) and more data-efficient — it generalizes better on minority classes. ViT-Base is larger (86M params) and captures more complex feature interactions. The ensemble averages their predictions, reducing individual model biases. Empirically, the ensemble consistently outperforms either model by 1–1.5%.

### Q2: How do you handle the significant class imbalance?

**Answer:** Three mechanisms: (1) Focal Loss (γ=2.0) reduces the loss contribution of well-classified majority-class samples, forcing the model to learn harder cases. (2) MixUp augmentation creates synthetic inter-class training examples. (3) Stratified splitting ensures all classes are proportionally represented in train/val/test sets.

### Q3: Can this system replace a gastroenterologist?

**Answer:** No, and it is not designed to. This is a decision-support tool. It provides a rapid second opinion with transparent evidence. Final diagnostic authority always remains with the clinician. The uncertainty estimation feature specifically identifies cases where the AI is unsure, routing them for priority human review.

### Q4: How does your Grad-CAM work with TorchScript models?

**Answer:** Standard Grad-CAM libraries (like torchcam) use Python hook mechanisms that don't work with TorchScript traced models. We implemented a custom gradient-based saliency approach: we enable gradient tracking on the input tensor, compute the loss for the predicted class, backpropagate, and use the resulting input-space gradients to generate the activation map. This is mathematically equivalent to Grad-CAM but compatible with TorchScript.

### Q5: What is the inference cost in a real deployment?

**Answer:** On GPU: 0.3–0.8 seconds per image. On CPU: 1–3 seconds. The total model storage is ~433 MB. Memory usage is ~2 GB GPU or ~4 GB CPU. The system can handle 50+ concurrent users with proper scaling. For high-volume scenarios, Kubernetes horizontal scaling is in our roadmap.

### Q6: How is this different from existing GI AI tools?

**Answer:** Four differentiators: (1) **Multi-model ensemble** with TTA, not single-model. (2) **Four explainability methods** instead of just Grad-CAM. (3) **Full deployment stack** — most research projects stop at the notebook. (4) **Uncertainty estimation** — the system knows when it doesn't know.

### Q7: What external validation has been done?

**Answer:** Current evaluation is on the held-out Hyper-Kvasir test set (1,600 images). The next milestone is prospective validation with a partnering hospital's clinical data, which will be critical for regulatory readiness.

### Q8: Can the system handle video input from live endoscopy?

**Answer:** The current version handles single frames. Extending to real-time video would require frame extraction pipelines and potentially temporal models (e.g., Video ViT). This is a roadmap item.

---

## APPENDIX B — 90-Second Emergency Script

> **USE IF:** Time is severely cut, or you need a rapid summary.

We built a full-stack GI endoscopy diagnostic platform that processes 10,662 labeled endoscopy images across 23 gastrointestinal conditions. The training pipeline uses two Vision Transformers — DeiT3 Small and ViT Base — at 384×384 resolution, trained with Focal Loss, MixUp, gradient accumulation, mixed precision, label smoothing, and cosine warmup scheduling.

The ensemble with test-time augmentation achieves approximately 95.2% accuracy — exceeding either individual model.

For explainability, we provide Grad-CAM heatmaps, multi-layer visualization, attention rollout, lesion localization masks, and Monte Carlo dropout uncertainty estimation.

The system is deployed as a FastAPI backend serving TorchScript-traced models, with a React frontend featuring 18 configurable parameters for clinical customization. Everything is Dockerized with both development and production compose files, ready for cloud deployment.

This is an end-to-end, transparent, production-ready clinical decision-support system.

---

## APPENDIX C — Technical Reference Card

```
PROJECT:           GI Endoscopy AI Diagnostic Platform
DATASET:           Hyper-Kvasir (10,662 images, 23 classes)
MODELS:            DeiT3-S/16-384 (22M) + ViT-B/16-384 (86M)
TRAINING:          Focal Loss, MixUp, GradAccum×8, AMP, LabelSmooth, CosineWarmup
BEST ACCURACY:     ~95.2% (Ensemble + TTA)
BACKEND:           Python 3.10, FastAPI, PyTorch, TorchScript
FRONTEND:          React 18, Tailwind CSS 3.3, Axios
EXPLAINABILITY:    Grad-CAM, Multi-layer, Attention Rollout, Lesion Mask, MC Uncertainty
DEPLOYMENT:        Docker Compose (dev + prod), Nginx, CORS, Health Checks
API ENDPOINTS:     /predict, /health, /generate-report, /preprocess
MODEL FILES:       deit3_best_traced.pt (88MB), vit_best_traced.pt (345MB)
REPO:              github.com/AyanAhmedKhan/GI-Endoscopy-AI-Diagnostic-Platform
```