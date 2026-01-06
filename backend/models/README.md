---
title: "ViT Base Patch16 384 – GI Endoscopy Classifier"
emoji: "🔬"
colorFrom: blue
colorTo: purple
sdk: pytorch
sdk_version: "2.0"
app_file: app.py
pinned: false
tags:
  - vision-transformer
  - vit
  - image-classification
  - medical-imaging
  - gastrointestinal
  - endoscopy
  - hyper-kvasir
  - pytorch
  - timm
  - deep-learning
library_name: timm
license: other
language: en
pipeline_tag: image-classification
datasets:
  - hyper-kvasir
metrics:
  - accuracy
  - precision
  - recall
  - f1
---

<div align="center">

# 🔬 ViT Base Patch16 384 – GI Endoscopy Classifier

**State-of-the-art Vision Transformer for 23-class Gastrointestinal Endoscopy Image Classification**

[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red?logo=pytorch)](https://pytorch.org)
[![timm](https://img.shields.io/badge/timm-0.9+-blue)](https://github.com/huggingface/pytorch-image-models)
[![License](https://img.shields.io/badge/License-Research-green)]()
[![Accuracy](https://img.shields.io/badge/Test%20Accuracy-93.25%25-brightgreen)]()

</div>

---

## 📋 Overview

This repository contains a fine-tuned **ViT Base Patch16 384** model for classifying gastrointestinal endoscopy images into 23 anatomical/pathological categories. Trained on the [Hyper-Kvasir](https://datasets.simula.no/hyper-kvasir/) dataset with advanced augmentation techniques including MixUp, Focal Loss, and Test-Time Augmentation (TTA).

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎯 **High Accuracy** | 93.25% test accuracy with TTA |
| 🔥 **Modern Architecture** | ViT Base Patch16 @ 384×384 resolution |
| 📊 **Robust Training** | MixUp, Focal Loss, Label Smoothing, CoarseDropout |
| ⚡ **Production Ready** | TorchScript traced weights for fast inference |
| 🧪 **TTA Support** | Test-Time Augmentation for improved predictions |

---

## 📈 Performance Metrics

### Final Results

| Metric | Validation (Best) | Test (with TTA) |
|--------|-------------------|-----------------|
| **Accuracy** | 92.18% | **93.25%** |
| **Precision** | – | 92.19% |
| **Recall** | – | 93.25% |
| **F1-Score** | – | 92.59% |

### Training Progression

| Epoch | Train Acc | Val Acc | Learning Rate | Checkpoint |
|-------|-----------|---------|---------------|------------|
| 1 | 50.58% | 81.93% | 4.00e-06 | ✅ |
| 2 | 67.99% | 86.68% | 6.00e-06 | ✅ |
| 3 | 74.18% | 87.87% | 8.00e-06 | ✅ |
| 4 | 74.81% | 88.81% | 1.00e-05 | ✅ |
| 5 | 77.37% | 89.12% | 1.00e-05 | ✅ |
| 6 | 77.56% | 89.49% | 9.94e-06 | ✅ |
| 8 | 80.09% | 90.56% | 9.46e-06 | ✅ |
| 9 | 80.08% | 90.68% | 9.05e-06 | ✅ |
| 10 | 80.44% | 90.81% | 8.54e-06 | ✅ |
| 12 | 82.21% | 91.62% | 7.27e-06 | ✅ |
| 16 | 85.41% | 91.74% | 4.22e-06 | ✅ |
| 18 | 84.59% | 92.06% | 2.73e-06 | ✅ |
| 20 | 86.29% | 92.12% | 1.46e-06 | ✅ |
| **21** | **85.86%** | **92.18%** | 9.55e-07 | ✅ **Best** |
| 25 | 86.17% | 92.12% | 0.00e+00 | – |

---

## 🏗️ Model Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ViT Base Patch16 384                     │
├─────────────────────────────────────────────────────────────┤
│  Input:        384 × 384 × 3 (RGB)                          │
│  Patch Size:   16 × 16                                      │
│  Patches:      (384/16)² = 576 patches                      │
│  Hidden Dim:   768                                          │
│  Layers:       12 Transformer blocks                        │
│  Heads:        12 attention heads                           │
│  Parameters:   86,108,183 (~86.1M)                          │
│  Output:       23 classes (softmax)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Dataset: Hyper-Kvasir

| Split | Images | Classes |
|-------|--------|---------|
| Train | 7,463 | 23 |
| Validation | 1,599 | 23 |
| Test | 1,600 | 23 |
| **Total** | **10,662** | **23** |

### 23 GI Classes
Anatomical landmarks and pathological findings from upper and lower GI tract endoscopy.

---

## ⚙️ Training Configuration

### Environment
```
PyTorch:     2.x (CUDA 11.8)
GPU:         NVIDIA GPU with ~16GB VRAM
Python:      3.12
Platform:    Google Colab
```

### Dependencies
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install timm "albumentations>=1.0.0" opencv-python Pillow numpy scikit-learn matplotlib seaborn tqdm
```

### Hyperparameters

| Parameter | Value |
|-----------|-------|
| Model | `vit_base_patch16_384` |
| Image Size | 384 × 384 |
| Batch Size | 2 |
| Effective Batch Size | 16 (8× gradient accumulation) |
| Epochs | 25 |
| Base Learning Rate | 1e-5 |
| Optimizer | AdamW (weight_decay=0.01) |
| Scheduler | Cosine Annealing + 5-epoch Warmup |
| Loss | Focal Loss (γ=2.0) + Label Smoothing (0.1) |
| Mixed Precision | ✅ FP16 (GradScaler) |
| MixUp | ✅ (α=0.2, p=0.5) |

### Data Augmentation (Albumentations)

**Training:**
```python
A.Compose([
    A.Resize(384, 384),
    A.HorizontalFlip(p=0.5),
    A.VerticalFlip(p=0.3),
    A.RandomRotate90(p=0.5),
    A.ShiftScaleRotate(shift_limit=0.1, scale_limit=0.1, rotate_limit=15, p=0.5),
    A.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1, p=0.5),
    A.GaussNoise(p=0.3),
    A.CoarseDropout(max_holes=1, max_height=32, max_width=32, p=0.3),
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2()
])
```

**Validation/Test:**
```python
A.Compose([
    A.Resize(384, 384),
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2()
])
```

---

## 🚀 Quick Start

### Installation

```bash
pip install torch torchvision timm albumentations
```

### Inference (TorchScript)

```python
import torch
from PIL import Image
from torchvision import transforms

# Load traced model
model = torch.jit.load("vit_best_traced.pt")
model.eval()

# Preprocessing (must match training)
preprocess = transforms.Compose([
    transforms.Resize((384, 384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load and classify image
img = Image.open("endoscopy_image.jpg").convert("RGB")
tensor = preprocess(img).unsqueeze(0)

with torch.no_grad():
    logits = model(tensor)
    probs = logits.softmax(dim=1)
    confidence, pred_class = probs.max(dim=1)

print(f"Predicted class: {pred_class.item()}")
print(f"Confidence: {confidence.item():.2%}")
```

### Inference with Test-Time Augmentation (TTA)

```python
import torch
from PIL import Image
from torchvision import transforms

model = torch.jit.load("vit_best_traced.pt")
model.eval()

preprocess = transforms.Compose([
    transforms.Resize((384, 384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def predict_with_tta(model, tensor):
    """Test-Time Augmentation: average predictions across flips"""
    with torch.no_grad():
        # Original
        pred1 = model(tensor).softmax(dim=1)
        # Horizontal flip
        pred2 = model(torch.flip(tensor, [3])).softmax(dim=1)
        # Vertical flip
        pred3 = model(torch.flip(tensor, [2])).softmax(dim=1)
        # Average
        return (pred1 + pred2 + pred3) / 3.0

img = Image.open("endoscopy_image.jpg").convert("RGB")
tensor = preprocess(img).unsqueeze(0)

probs = predict_with_tta(model, tensor)
confidence, pred_class = probs.max(dim=1)

print(f"Predicted class (TTA): {pred_class.item()}")
print(f"Confidence: {confidence.item():.2%}")
```

### Batch Inference

```python
import torch
from PIL import Image
from torchvision import transforms
from pathlib import Path

model = torch.jit.load("vit_best_traced.pt")
model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

preprocess = transforms.Compose([
    transforms.Resize((384, 384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def classify_batch(image_paths, batch_size=8):
    results = []
    for i in range(0, len(image_paths), batch_size):
        batch_paths = image_paths[i:i+batch_size]
        tensors = []
        for path in batch_paths:
            img = Image.open(path).convert("RGB")
            tensors.append(preprocess(img))
        
        batch = torch.stack(tensors).to(device)
        with torch.no_grad():
            probs = model(batch).softmax(dim=1)
            confidences, preds = probs.max(dim=1)
        
        for path, pred, conf in zip(batch_paths, preds, confidences):
            results.append({
                "file": str(path),
                "class": pred.item(),
                "confidence": conf.item()
            })
    return results

# Example usage
image_folder = Path("./test_images")
image_paths = list(image_folder.glob("*.jpg"))
results = classify_batch(image_paths)
```

---

## 📁 Repository Structure

```
.
├── vit_best_traced.pt          # TorchScript traced weights (best checkpoint)
├── README.md                   # This file
└── class_mapping.json          # (Optional) Class index to name mapping
```

---

## 🔧 Advanced: Custom Training

### Focal Loss Implementation

```python
class FocalLoss(nn.Module):
    def __init__(self, alpha=1, gamma=2, reduction='mean'):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.reduction = reduction

    def forward(self, inputs, targets):
        ce_loss = F.cross_entropy(inputs, targets, reduction='none')
        pt = torch.exp(-ce_loss)
        focal_loss = self.alpha * (1 - pt) ** self.gamma * ce_loss
        
        if self.reduction == 'mean':
            return focal_loss.mean()
        return focal_loss.sum() if self.reduction == 'sum' else focal_loss
```

### MixUp Implementation

```python
def mixup_data(x, y, alpha=0.2):
    lam = np.random.beta(alpha, alpha) if alpha > 0 else 1
    batch_size = x.size(0)
    index = torch.randperm(batch_size).to(x.device)
    
    mixed_x = lam * x + (1 - lam) * x[index]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam

def mixup_criterion(criterion, pred, y_a, y_b, lam):
    return lam * criterion(pred, y_a) + (1 - lam) * criterion(pred, y_b)
```

---

## ⚠️ Limitations & Responsible Use

> **⚕️ Medical Disclaimer**
> 
> This model is a **research artifact** and is **NOT** a regulated medical device. It should **NOT** be used for clinical diagnosis without proper validation and regulatory approval.

### Known Limitations
- Trained on Hyper-Kvasir dataset; may not generalize to other endoscopy equipment or populations
- Best performance requires 384×384 input resolution
- TTA improves accuracy but increases inference time 3×

### Recommended Use
- ✅ Research and educational purposes
- ✅ Preliminary screening with human oversight
- ✅ Benchmark for GI image classification
- ❌ Standalone clinical diagnosis
- ❌ Life-critical medical decisions

---

## 📚 Citation

If you use this model in your research, please cite:

```bibtex
@misc{vit_gi_endoscopy_2025,
  author       = {Ayan Ahmed Khan},
  title        = {ViT Base Patch16 384 for GI Endoscopy Classification},
  year         = {2025},
  publisher    = {Hugging Face},
  url          = {https://huggingface.co/ayanahmedkhan/VIT-gi-endoscopy-classifier}
}
```

### Related Work
- [An Image is Worth 16x16 Words (ViT)](https://arxiv.org/abs/2010.11929)
- [Hyper-Kvasir Dataset](https://datasets.simula.no/hyper-kvasir/)
- [timm Library](https://github.com/huggingface/pytorch-image-models)

---

## 📝 Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-29 | 1.0.0 | Initial release with traced weights and full documentation |

---

## 📬 Contact

- **Author:** Ayan Ahmed Khan
- **Hugging Face:** [ayanahmedkhan](https://huggingface.co/ayanahmedkhan)

---

<div align="center">

**Made with ❤️ for Medical AI Research**

</div>
