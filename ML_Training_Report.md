# GI Endoscopy AI Diagnostic System - Machine Learning Training Report

**Project:** Advanced Vision Transformer Ensemble for Gastrointestinal Endoscopy Image Classification  
**Date:** 2025  
**Author:** AI Diagnosis Team  
**Version:** 1.0

---

## Executive Summary

This report documents the development and training of an advanced ensemble-based deep learning system for automated classification of gastrointestinal (GI) endoscopy images. The system employs state-of-the-art Vision Transformer (ViT) architectures, specifically DeiT3 (Data-efficient Image Transformer) and ViT Base, trained at 384×384 resolution with advanced data augmentation and optimization techniques.

### Key Achievements

- **Architecture:** Ensemble of DeiT3 Small and ViT Base models
- **Resolution:** 384×384 pixels (high-resolution input)
- **Advanced Techniques:** MixUp augmentation, Focal Loss, Test-Time Augmentation (TTA), Label Smoothing
- **Memory Optimization:** Gradient accumulation, mixed precision training
- **Performance:** Optimized for medical image classification with class imbalance handling

---

## 1. Introduction

### 1.1 Problem Statement

Gastrointestinal endoscopy image classification requires high accuracy and reliability for medical diagnosis. The challenge involves:
- Class imbalance across 23 different GI conditions
- High-resolution medical image processing
- Limited computational resources (memory constraints)
- Need for explainable AI predictions

### 1.2 Solution Approach

An ensemble-based approach combining two Vision Transformer models:
1. **DeiT3 Small Patch16 384** - Efficient transformer architecture
2. **ViT Base Patch16 384** - Standard Vision Transformer

Both models are trained independently and combined using weighted ensemble predictions.

---

## 2. Methodology

### 2.1 Dataset Structure

The training pipeline expects a directory structure with class-based folders:
```
dataset/
├── class_1/
│   ├── image1.jpg
│   └── image2.jpg
├── class_2/
│   └── ...
└── ...
```

**Total Classes:** 23 GI conditions including:
- Barrett's esophagus
- Esophagitis (grades A-D)
- Polyps (various types)
- Ulcerative colitis (grades 0-3)
- Hemorrhoids
- Anatomical landmarks (Cecum, Ileum, Pylorus)
- And more...

### 2.2 Data Preprocessing

**Image Size:** 384×384 pixels (high resolution for medical imaging)

**Normalization:** ImageNet statistics
- Mean: [0.485, 0.456, 0.406]
- Std: [0.229, 0.224, 0.225]

**Data Format:** RGB images converted to PyTorch tensors

---

## 3. Model Architecture

### 3.1 Vision Transformer (ViT) Architecture

Both models use the Vision Transformer architecture with:
- **Patch Size:** 16×16 pixels
- **Input Resolution:** 384×384 pixels
- **Embedding Dimension:** Model-specific (DeiT3 Small vs ViT Base)
- **Attention Heads:** Multi-head self-attention mechanism
- **Output:** 23-class classification logits

### 3.2 Model Specifications

#### DeiT3 Small Patch16 384
- **Parameters:** ~22M parameters
- **Efficiency:** Optimized for training efficiency
- **Architecture:** Data-efficient Image Transformer variant

#### ViT Base Patch16 384
- **Parameters:** ~86M parameters
- **Capacity:** Larger model for better feature representation
- **Architecture:** Standard Vision Transformer

---

## 4. Training Configuration

### 4.1 Hyperparameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Image Size** | 384×384 | High resolution for medical detail |
| **Batch Size** | 2 | Memory constraints with 384px images |
| **Effective Batch Size** | 16 | Via gradient accumulation (8 steps) |
| **Learning Rate** | 1e-5 | Conservative learning rate for fine-tuning |
| **Epochs** | 25 | Sufficient for convergence |
| **Optimizer** | AdamW | Weight decay: 0.01 |
| **Weight Decay** | 0.01 | Regularization |

### 4.2 Learning Rate Schedule

**Warmup + Cosine Annealing:**
- **Warmup Epochs:** 5
- **Warmup Strategy:** Linear increase from 0 to initial LR
- **After Warmup:** Cosine annealing to 0
- **Formula:** `LR = 0.5 * (1 + cos(π * progress))`

### 4.3 Loss Functions

#### Primary: Focal Loss
```python
Focal Loss = α * (1 - pt)^γ * CrossEntropy
```
- **Alpha (α):** 1.0
- **Gamma (γ):** 2.0
- **Purpose:** Address class imbalance by focusing on hard examples

#### Secondary: Cross-Entropy with Label Smoothing
- **Smoothing Factor:** 0.1
- **Usage:** Combined with MixUp augmentation
- **Purpose:** Prevent overconfidence and improve generalization

### 4.4 Data Augmentation

#### Training Augmentations (Albumentations)
1. **Resize:** 384×384
2. **Horizontal Flip:** p=0.5
3. **Vertical Flip:** p=0.3
4. **Random Rotate 90°:** p=0.5
5. **ShiftScaleRotate:** 
   - Shift: ±10%
   - Scale: ±10%
   - Rotate: ±15°
   - p=0.5
6. **ColorJitter:**
   - Brightness: ±20%
   - Contrast: ±20%
   - Saturation: ±20%
   - Hue: ±10%
   - p=0.5
7. **Gaussian Noise:** p=0.3
8. **CoarseDropout:**
   - Max holes: 1
   - Max size: 32×32
   - p=0.3
9. **Normalization:** ImageNet statistics

#### Validation/Test Augmentations
- **Resize:** 384×384
- **Normalization:** ImageNet statistics
- **No augmentation** (for fair evaluation)

### 4.5 Advanced Training Techniques

#### 1. MixUp Augmentation
- **Probability:** 50% chance per batch
- **Alpha:** 0.2 (Beta distribution parameter)
- **Method:** Linear interpolation between images and labels
- **Formula:** `mixed = λ * image1 + (1-λ) * image2`

#### 2. Gradient Accumulation
- **Steps:** 8 accumulation steps
- **Effective Batch Size:** 2 × 8 = 16
- **Purpose:** Simulate larger batch size within memory constraints

#### 3. Mixed Precision Training
- **Framework:** PyTorch Automatic Mixed Precision (AMP)
- **Precision:** FP16 for forward pass, FP32 for gradients
- **Scaler:** GradientScaler for loss scaling
- **Benefit:** 2× memory reduction, faster training

#### 4. Test-Time Augmentation (TTA)
- **Enabled:** Yes (for inference)
- **Augmentations:**
  - Original image
  - Horizontal flip
  - Vertical flip
- **Prediction:** Average of 3 predictions
- **Benefit:** Improved robustness and accuracy

---

## 5. Training Process

### 5.1 Training Pipeline

#### Phase 1: DeiT3 Training
1. Initialize DeiT3 Small Patch16 384 model
2. Load ImageNet pretrained weights
3. Train for 25 epochs with advanced augmentations
4. Save best checkpoint based on validation accuracy
5. Evaluate with TTA on test set

#### Phase 2: ViT Base Training
1. Initialize ViT Base Patch16 384 model
2. Load ImageNet pretrained weights
3. Train for 25 epochs (same configuration)
4. Save best checkpoint
5. Evaluate with TTA

#### Phase 3: Ensemble Evaluation
1. Load best checkpoints from both models
2. Create weighted ensemble (based on validation accuracy)
3. Evaluate ensemble with TTA on test set
4. Generate final metrics

### 5.2 Memory Management

**Optimizations:**
- Gradient accumulation (reduces memory per step)
- Mixed precision training (FP16/FP32)
- Model cleanup after training
- GPU cache clearing
- BatchNorm kept in training mode for better calibration

**Memory Monitoring:**
- GPU memory tracking before/after training
- Automatic cleanup between model training

### 5.3 Checkpoint Management

**Strategy:** Save only the best model based on validation accuracy
- **Location:** `advanced_checkpoints/`
- **Naming:** `{model_name}_acc_{accuracy:.2f}.pth`
- **Contents:**
  - Model state dict
  - Training configuration
  - Epoch number
  - Validation accuracy
  - Training hyperparameters

---

## 6. Evaluation Metrics

### 6.1 Metrics Computed

1. **Accuracy:** Overall classification accuracy
2. **Precision:** Weighted average precision (handles class imbalance)
3. **Recall:** Weighted average recall
4. **F1-Score:** Weighted average F1-score

### 6.2 Evaluation Strategy

- **Test-Time Augmentation:** Enabled for robust predictions
- **Batch Processing:** Batch size of 2 for consistency
- **No Data Leakage:** Separate test set, no augmentation during validation

---

## 7. Code Architecture

### 7.1 Core Classes

#### `FocalLoss`
- Custom loss function for class imbalance
- Parameters: alpha, gamma, reduction
- Formula: `α * (1 - pt)^γ * CE_loss`

#### `OptimizedMedicalDataset`
- PyTorch Dataset for medical images
- Automatic class discovery
- Error handling for corrupted images
- Flexible transform support

#### `AdvancedMemoryEfficientTrainer`
- Complete training pipeline
- Memory-optimized training
- Advanced augmentation support
- TTA implementation
- Checkpoint management

#### `AdvancedMemoryEfficientEnsemble`
- Multi-model ensemble
- Weighted predictions
- TTA support
- Efficient inference

### 7.2 Key Functions

#### `mixup_data()`
- Implements MixUp augmentation
- Beta distribution sampling
- Random permutation for mixing

#### `mixup_criterion()`
- Computes loss for mixed samples
- Weighted combination of two losses

#### `get_cosine_warmup_scheduler()`
- Learning rate scheduling
- Warmup phase + cosine annealing

---

## 8. Technical Innovations

### 8.1 Advanced Techniques Implemented

1. **Focal Loss:** Addresses class imbalance without resampling
2. **MixUp:** Regularization through data interpolation
3. **Label Smoothing:** Prevents overconfidence
4. **Test-Time Augmentation:** Improves inference robustness
5. **Gradient Accumulation:** Enables larger effective batch sizes
6. **Mixed Precision:** Memory and speed optimization
7. **Weighted Ensemble:** Combines model strengths
8. **Cosine Warmup:** Smooth learning rate schedule

### 8.2 Medical Imaging Optimizations

- **High Resolution (384px):** Captures fine medical details
- **Robust Augmentation:** Simulates real-world variations
- **TTA:** Reduces prediction variance
- **Ensemble:** Improves reliability for medical diagnosis

---

## 9. Training Results

### 9.1 Individual Model Performance

#### DeiT3 Small Patch16 384
- **Best Validation Accuracy:** [To be filled from training logs]
- **Test Accuracy (with TTA):** [To be filled]
- **Model Size:** ~22M parameters
- **Training Time:** [To be filled]

#### ViT Base Patch16 384
- **Best Validation Accuracy:** [To be filled from training logs]
- **Test Accuracy (with TTA):** [To be filled]
- **Model Size:** ~86M parameters
- **Training Time:** [To be filled]

### 9.2 Ensemble Performance

- **Test Accuracy:** [To be filled]
- **Test Precision:** [To be filled]
- **Test Recall:** [To be filled]
- **Test F1-Score:** [To be filled]
- **Ensemble Weights:** [Based on validation accuracies]

### 9.3 Training History

Training metrics are saved in JSON format:
- `deit3_training_history.json`
- `vit_training_history.json`

Each contains:
- Epoch-by-epoch training accuracy
- Validation accuracy
- Learning rate schedule
- Best epoch identification

---

## 10. Model Deployment

### 10.1 Model Conversion

Models are converted to TorchScript for deployment:
```python
# Example conversion
traced_model = torch.jit.trace(model, example_input)
traced_model.save("model_traced.pt")
```

### 10.2 Deployment Architecture

- **Backend:** FastAPI with TorchScript models
- **Inference:** Optimized for production
- **Explainability:** Grad-CAM visualization
- **API:** RESTful endpoints for predictions

---

## 11. Computational Requirements

### 11.1 Hardware

**Minimum:**
- GPU: 8GB VRAM (for batch size 2)
- RAM: 16GB
- Storage: 50GB+ (for datasets and checkpoints)

**Recommended:**
- GPU: 16GB+ VRAM (NVIDIA RTX 3090/4090 or A100)
- RAM: 32GB+
- Storage: 100GB+ SSD

### 11.2 Software

- **Python:** 3.8+
- **PyTorch:** 2.0+
- **CUDA:** 11.8+ (for GPU training)
- **Libraries:**
  - timm (Vision Transformers)
  - albumentations (Augmentation)
  - torch, torchvision
  - sklearn (Metrics)
  - PIL, numpy, cv2

### 11.3 Training Time Estimates

- **DeiT3:** ~X hours on [GPU model]
- **ViT Base:** ~Y hours on [GPU model]
- **Total:** ~Z hours for complete pipeline

---

## 12. Limitations and Future Work

### 12.1 Current Limitations

1. **Batch Size:** Limited to 2 due to 384px resolution
2. **Memory:** Requires significant GPU memory
3. **Training Time:** Long training cycles
4. **Dataset:** Dependent on quality and size of training data

### 12.2 Future Improvements

1. **Larger Models:** Experiment with ViT Large
2. **More Augmentations:** Advanced medical-specific augmentations
3. **Self-Supervised Learning:** Pretraining on unlabeled medical images
4. **Active Learning:** Intelligent data selection
5. **Multi-Scale Training:** Variable resolution training
6. **Attention Visualization:** Better explainability

---

## 13. Conclusion

This training pipeline represents a state-of-the-art approach to GI endoscopy image classification, combining:

- **Advanced Architectures:** Vision Transformers at high resolution
- **Modern Techniques:** MixUp, Focal Loss, TTA, Label Smoothing
- **Memory Efficiency:** Gradient accumulation, mixed precision
- **Robust Evaluation:** Ensemble predictions with TTA

The system is designed for production deployment with:
- TorchScript optimization
- FastAPI backend
- Grad-CAM explainability
- RESTful API interface

### Key Takeaways

1. **High Resolution Matters:** 384px captures important medical details
2. **Ensemble Improves Reliability:** Combining models reduces errors
3. **Advanced Augmentation:** MixUp and TTA significantly improve performance
4. **Class Imbalance Handling:** Focal Loss is crucial for medical datasets
5. **Memory Optimization:** Enables training on consumer GPUs

---

## 14. References

### Papers and Resources

1. **Vision Transformer (ViT):** Dosovitskiy et al., "An Image is Worth 16x16 Words"
2. **DeiT:** Touvron et al., "Training data-efficient image transformers"
3. **Focal Loss:** Lin et al., "Focal Loss for Dense Object Detection"
4. **MixUp:** Zhang et al., "mixup: Beyond Empirical Risk Minimization"
5. **Label Smoothing:** Szegedy et al., "Rethinking the Inception Architecture"

### Libraries

- **timm:** PyTorch Image Models
- **albumentations:** Fast image augmentation library
- **PyTorch:** Deep learning framework

---

## Appendix A: Training Configuration Summary

```json
{
  "models": [
    "deit3_small_patch16_384",
    "vit_base_patch16_384"
  ],
  "image_size": 384,
  "batch_size": 2,
  "effective_batch_size": 16,
  "epochs": 25,
  "learning_rate": 1e-5,
  "optimizer": "AdamW",
  "weight_decay": 0.01,
  "loss_functions": [
    "FocalLoss (gamma=2.0)",
    "CrossEntropy with Label Smoothing (0.1)"
  ],
  "augmentations": {
    "training": [
      "HorizontalFlip (p=0.5)",
      "VerticalFlip (p=0.3)",
      "RandomRotate90 (p=0.5)",
      "ShiftScaleRotate (p=0.5)",
      "ColorJitter (p=0.5)",
      "GaussianNoise (p=0.3)",
      "CoarseDropout (p=0.3)"
    ],
    "mixup": {
      "enabled": true,
      "alpha": 0.2,
      "probability": 0.5
    }
  },
  "advanced_features": {
    "gradient_accumulation": 8,
    "mixed_precision": true,
    "test_time_augmentation": true,
    "warmup_scheduler": true,
    "warmup_epochs": 5,
    "cosine_annealing": true
  },
  "num_classes": 23
}
```

---

## Appendix B: Class Mapping

The system classifies 23 GI conditions:

```python
class_mapping = {
    0: "barretts",
    1: "barretts-short-segment",
    2: "bbps-0-1",
    3: "bbps-2-3",
    4: "cecum",
    5: "dyed-lifted-polyps",
    6: "dyed-resection-margins",
    7: "esophagitis-a",
    8: "esophagitis-b-d",
    9: "hemorrhoids",
    10: "ileum",
    11: "impacted-stool",
    12: "polyps",
    13: "pylorus",
    14: "retroflex-rectum",
    15: "retroflex-stomach",
    16: "ulcerative-colitis-grade-0-1",
    17: "ulcerative-colitis-grade-1",
    18: "ulcerative-colitis-grade-1-2",
    19: "ulcerative-colitis-grade-2",
    20: "ulcerative-colitis-grade-2-3",
    21: "ulcerative-colitis-grade-3",
    22: "z-line"
}
```

---

## Appendix C: Code Structure

```
training_pipeline/
├── Cell 4: Core Classes
│   ├── FocalLoss
│   ├── mixup_data()
│   ├── mixup_criterion()
│   └── OptimizedMedicalDataset
├── Cell 5: Advanced Trainer
│   └── AdvancedMemoryEfficientTrainer
│       ├── get_advanced_transforms()
│       ├── get_cosine_warmup_scheduler()
│       ├── train()
│       ├── validate()
│       ├── predict_with_tta()
│       ├── evaluate()
│       └── save_checkpoint()
├── Cell 6: DeiT3 Training
├── Cell 7: ViT Base Training
├── Cell 8: Ensemble
│   └── AdvancedMemoryEfficientEnsemble
└── Cell 9: Results & Visualization
```

---

**Report Generated:** 2025  
**Status:** Complete  
**Next Steps:** Fill in actual training results and metrics

---

*This report documents the complete machine learning training pipeline for the GI Endoscopy AI Diagnostic System. For questions or clarifications, please refer to the code repository or contact the development team.*

