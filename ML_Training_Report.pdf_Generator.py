"""
Generate PDF version of the ML Training Report
Run this script to create a professional PDF report
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
import json

def create_ml_training_report_pdf(output_filename="ML_Training_Report.pdf"):
    """Generate a comprehensive PDF report for ML training"""
    
    doc = SimpleDocTemplate(output_filename, pagesize=A4,
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a237e'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading1_style = ParagraphStyle(
        'CustomHeading1',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#283593'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    heading2_style = ParagraphStyle(
        'CustomHeading2',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#3949ab'),
        spaceAfter=10,
        spaceBefore=10,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        leading=14
    )
    
    # Title
    elements.append(Paragraph("GI Endoscopy AI Diagnostic System", title_style))
    elements.append(Paragraph("Machine Learning Training Report", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Metadata
    metadata = [
        ["Project:", "Advanced Vision Transformer Ensemble for GI Endoscopy"],
        ["Date:", datetime.now().strftime("%B %d, %Y")],
        ["Version:", "1.0"],
        ["Author:", "AI Diagnosis Team"]
    ]
    
    metadata_table = Table(metadata, colWidths=[1.5*inch, 4.5*inch])
    metadata_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#283593')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(metadata_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Executive Summary
    elements.append(Paragraph("Executive Summary", heading1_style))
    elements.append(Paragraph(
        "This report documents the development and training of an advanced ensemble-based deep learning "
        "system for automated classification of gastrointestinal (GI) endoscopy images. The system employs "
        "state-of-the-art Vision Transformer (ViT) architectures, specifically DeiT3 and ViT Base, trained "
        "at 384×384 resolution with advanced data augmentation and optimization techniques.",
        normal_style
    ))
    
    # Key Achievements
    elements.append(Paragraph("Key Achievements", heading2_style))
    achievements = [
        "Architecture: Ensemble of DeiT3 Small and ViT Base models",
        "Resolution: 384×384 pixels (high-resolution input)",
        "Advanced Techniques: MixUp augmentation, Focal Loss, Test-Time Augmentation (TTA), Label Smoothing",
        "Memory Optimization: Gradient accumulation, mixed precision training",
        "Performance: Optimized for medical image classification with class imbalance handling"
    ]
    
    for achievement in achievements:
        elements.append(Paragraph(f"• {achievement}", normal_style))
    
    elements.append(PageBreak())
    
    # Methodology Section
    elements.append(Paragraph("1. Methodology", heading1_style))
    
    elements.append(Paragraph("1.1 Dataset Structure", heading2_style))
    elements.append(Paragraph(
        "The training pipeline expects a directory structure with class-based folders. The system "
        "classifies 23 different GI conditions including Barrett's esophagus, esophagitis, polyps, "
        "ulcerative colitis, hemorrhoids, and anatomical landmarks.",
        normal_style
    ))
    
    elements.append(Paragraph("1.2 Data Preprocessing", heading2_style))
    elements.append(Paragraph(
        "Images are resized to 384×384 pixels for high-resolution medical imaging. Normalization uses "
        "ImageNet statistics (mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225]). All images "
        "are converted to RGB format and transformed to PyTorch tensors.",
        normal_style
    ))
    
    # Model Architecture
    elements.append(PageBreak())
    elements.append(Paragraph("2. Model Architecture", heading1_style))
    
    elements.append(Paragraph("2.1 Vision Transformer Architecture", heading2_style))
    elements.append(Paragraph(
        "Both models use the Vision Transformer architecture with 16×16 pixel patches, 384×384 input "
        "resolution, multi-head self-attention mechanism, and 23-class classification output.",
        normal_style
    ))
    
    # Training Configuration Table
    elements.append(Paragraph("3. Training Configuration", heading1_style))
    
    training_config = [
        ["Parameter", "Value", "Rationale"],
        ["Image Size", "384×384", "High resolution for medical detail"],
        ["Batch Size", "2", "Memory constraints with 384px images"],
        ["Effective Batch Size", "16", "Via gradient accumulation (8 steps)"],
        ["Learning Rate", "1e-5", "Conservative learning rate for fine-tuning"],
        ["Epochs", "25", "Sufficient for convergence"],
        ["Optimizer", "AdamW", "Weight decay: 0.01"],
        ["Weight Decay", "0.01", "Regularization"]
    ]
    
    config_table = Table(training_config, colWidths=[2*inch, 1.5*inch, 2.5*inch])
    config_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3949ab')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
    ]))
    elements.append(config_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Advanced Techniques
    elements.append(Paragraph("4. Advanced Training Techniques", heading1_style))
    
    techniques = [
        ("MixUp Augmentation", "50% chance per batch, alpha=0.2, linear interpolation between images and labels"),
        ("Gradient Accumulation", "8 accumulation steps, effective batch size of 16"),
        ("Mixed Precision Training", "FP16 for forward pass, FP32 for gradients, 2× memory reduction"),
        ("Test-Time Augmentation", "Original + horizontal flip + vertical flip, average of 3 predictions"),
        ("Focal Loss", "Alpha=1.0, Gamma=2.0, addresses class imbalance"),
        ("Label Smoothing", "Smoothing factor 0.1, prevents overconfidence"),
        ("Cosine Warmup", "5 warmup epochs, then cosine annealing to 0")
    ]
    
    for technique, description in techniques:
        elements.append(Paragraph(f"<b>{technique}:</b> {description}", normal_style))
    
    elements.append(PageBreak())
    
    # Data Augmentation
    elements.append(Paragraph("5. Data Augmentation", heading1_style))
    
    elements.append(Paragraph("Training Augmentations:", heading2_style))
    augmentations = [
        "Resize: 384×384",
        "Horizontal Flip: p=0.5",
        "Vertical Flip: p=0.3",
        "Random Rotate 90°: p=0.5",
        "ShiftScaleRotate: ±10% shift/scale, ±15° rotation, p=0.5",
        "ColorJitter: ±20% brightness/contrast/saturation, ±10% hue, p=0.5",
        "Gaussian Noise: p=0.3",
        "CoarseDropout: Max 1 hole, 32×32 size, p=0.3"
    ]
    
    for aug in augmentations:
        elements.append(Paragraph(f"• {aug}", normal_style))
    
    # Code Architecture
    elements.append(PageBreak())
    elements.append(Paragraph("6. Code Architecture", heading1_style))
    
    elements.append(Paragraph("6.1 Core Classes", heading2_style))
    classes = [
        ("FocalLoss", "Custom loss function for class imbalance with alpha and gamma parameters"),
        ("OptimizedMedicalDataset", "PyTorch Dataset for medical images with automatic class discovery"),
        ("AdvancedMemoryEfficientTrainer", "Complete training pipeline with memory optimization"),
        ("AdvancedMemoryEfficientEnsemble", "Multi-model ensemble with weighted predictions")
    ]
    
    for class_name, description in classes:
        elements.append(Paragraph(f"<b>{class_name}:</b> {description}", normal_style))
    
    # Computational Requirements
    elements.append(PageBreak())
    elements.append(Paragraph("7. Computational Requirements", heading1_style))
    
    elements.append(Paragraph("7.1 Hardware", heading2_style))
    elements.append(Paragraph(
        "<b>Minimum:</b> GPU with 8GB VRAM, 16GB RAM, 50GB storage<br/>"
        "<b>Recommended:</b> GPU with 16GB+ VRAM (NVIDIA RTX 3090/4090 or A100), 32GB+ RAM, 100GB+ SSD",
        normal_style
    ))
    
    elements.append(Paragraph("7.2 Software", heading2_style))
    software = [
        "Python 3.8+",
        "PyTorch 2.0+",
        "CUDA 11.8+ (for GPU training)",
        "timm (Vision Transformers)",
        "albumentations (Augmentation)",
        "sklearn (Metrics)"
    ]
    
    for item in software:
        elements.append(Paragraph(f"• {item}", normal_style))
    
    # Conclusion
    elements.append(PageBreak())
    elements.append(Paragraph("8. Conclusion", heading1_style))
    
    elements.append(Paragraph(
        "This training pipeline represents a state-of-the-art approach to GI endoscopy image classification, "
        "combining advanced Vision Transformer architectures, modern training techniques, and memory-efficient "
        "optimizations. The system is designed for production deployment with TorchScript optimization, "
        "FastAPI backend, Grad-CAM explainability, and RESTful API interface.",
        normal_style
    ))
    
    elements.append(Paragraph("Key Takeaways:", heading2_style))
    takeaways = [
        "High Resolution Matters: 384px captures important medical details",
        "Ensemble Improves Reliability: Combining models reduces errors",
        "Advanced Augmentation: MixUp and TTA significantly improve performance",
        "Class Imbalance Handling: Focal Loss is crucial for medical datasets",
        "Memory Optimization: Enables training on consumer GPUs"
    ]
    
    for takeaway in takeaways:
        elements.append(Paragraph(f"• {takeaway}", normal_style))
    
    # Footer
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph(
        f"<i>Report Generated: {datetime.now().strftime('%B %d, %Y')}</i>",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, alignment=TA_CENTER, textColor=colors.grey)
    ))
    
    # Build PDF
    doc.build(elements)
    print(f"PDF report generated: {output_filename}")

if __name__ == "__main__":
    create_ml_training_report_pdf()
    print("ML Training Report PDF created successfully!")

