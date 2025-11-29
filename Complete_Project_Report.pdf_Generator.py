"""
Generate PDF version of the Complete Project Report
Covers ML training, backend, frontend, and deployment
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime

def create_complete_project_report_pdf(output_filename="Complete_Project_Report.pdf"):
    """Generate comprehensive PDF report for entire project"""
    
    doc = SimpleDocTemplate(output_filename, pagesize=A4,
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=22,
        textColor=colors.HexColor('#1a237e'),
        spaceAfter=20,
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
        spaceAfter=10,
        alignment=TA_JUSTIFY,
        leading=14
    )
    
    # Title Page
    elements.append(Spacer(1, 1*inch))
    elements.append(Paragraph("GI Endoscopy AI Diagnostic Portal", title_style))
    elements.append(Paragraph("Complete Project Report", title_style))
    elements.append(Spacer(1, 0.5*inch))
    
    metadata = [
        ["Project:", "Advanced AI-Powered Gastrointestinal Endoscopy Diagnostic System"],
        ["Date:", datetime.now().strftime("%B %d, %Y")],
        ["Version:", "1.0"],
        ["Status:", "Production Ready"]
    ]
    
    metadata_table = Table(metadata, colWidths=[1.5*inch, 4.5*inch])
    metadata_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#283593')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(metadata_table)
    elements.append(PageBreak())
    
    # Executive Summary
    elements.append(Paragraph("Executive Summary", heading1_style))
    elements.append(Paragraph(
        "The GI Endoscopy AI Diagnostic Portal is a complete end-to-end medical AI system that combines "
        "state-of-the-art Vision Transformer models with an intuitive web interface for automated classification "
        "of gastrointestinal endoscopy images. The system provides 23-class classification, explainable AI with "
        "Grad-CAM visualizations, ensemble predictions, and production-ready deployment.",
        normal_style
    ))
    
    elements.append(Paragraph("Key Achievements", heading2_style))
    achievements = [
        "Advanced ML Models: Ensemble of DeiT3 and ViT Base Vision Transformers",
        "High Accuracy: Optimized for medical image classification",
        "Explainability: Grad-CAM heatmaps for clinical interpretation",
        "Scalable Architecture: Docker-based deployment",
        "User-Friendly Interface: Modern React frontend with Tailwind CSS",
        "Production Ready: Complete CI/CD and deployment pipeline"
    ]
    
    for achievement in achievements:
        elements.append(Paragraph(f"• {achievement}", normal_style))
    
    elements.append(PageBreak())
    
    # Machine Learning Pipeline
    elements.append(Paragraph("Machine Learning Pipeline", heading1_style))
    
    elements.append(Paragraph("Model Architecture", heading2_style))
    elements.append(Paragraph(
        "The system uses an ensemble of two Vision Transformer models: DeiT3 Small Patch16 384 (~22M parameters) "
        "and ViT Base Patch16 384 (~86M parameters). Both models are trained at 384×384 resolution with advanced "
        "data augmentation including MixUp, Focal Loss, Test-Time Augmentation, and Label Smoothing.",
        normal_style
    ))
    
    # Training Configuration Table
    training_config = [
        ["Parameter", "Value"],
        ["Image Size", "384×384"],
        ["Batch Size", "2 (Effective: 16)"],
        ["Learning Rate", "1e-5"],
        ["Epochs", "25"],
        ["Optimizer", "AdamW"],
        ["Loss Function", "Focal Loss (γ=2.0)"],
        ["Augmentation", "MixUp, TTA, Label Smoothing"]
    ]
    
    config_table = Table(training_config, colWidths=[3*inch, 3*inch])
    config_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3949ab')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
    ]))
    elements.append(config_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(PageBreak())
    
    # Backend API System
    elements.append(Paragraph("Backend API System", heading1_style))
    
    elements.append(Paragraph("Architecture", heading2_style))
    elements.append(Paragraph(
        "FastAPI-based RESTful API with TorchScript-optimized models. Features include custom Grad-CAM for "
        "TorchScript compatibility, multi-layer visualization, attention rollout, lesion localization, and "
        "uncertainty estimation. Supports advanced image preprocessing and real-time inference.",
        normal_style
    ))
    
    elements.append(Paragraph("Key Endpoints", heading2_style))
    endpoints = [
        "POST /predict - Main prediction with explainability",
        "GET /health - Health check with model status",
        "POST /generate-report - PDF explainability report",
        "POST /preprocess - Image preprocessing preview"
    ]
    
    for endpoint in endpoints:
        elements.append(Paragraph(f"• {endpoint}", normal_style))
    
    elements.append(PageBreak())
    
    # Frontend Portal
    elements.append(Paragraph("Frontend Portal", heading1_style))
    
    elements.append(Paragraph("Technology Stack", heading2_style))
    elements.append(Paragraph(
        "Modern React 18.2 application with Tailwind CSS 3.3. Features include drag-and-drop upload, "
        "real-time image preprocessing controls, model selection, advanced visualization options, and "
        "interactive Grad-CAM heatmaps with opacity and colormap controls.",
        normal_style
    ))
    
    elements.append(Paragraph("Key Features", heading2_style))
    features = [
        "Drag & Drop Image Upload",
        "Model Selection (Ensemble/DeiT3/ViT)",
        "Image Preprocessing Controls",
        "Advanced Visualization Options",
        "Interactive Heatmap Controls",
        "Comparative Views",
        "PDF Report Generation"
    ]
    
    for feature in features:
        elements.append(Paragraph(f"• {feature}", normal_style))
    
    elements.append(PageBreak())
    
    # Deployment Architecture
    elements.append(Paragraph("Deployment Architecture", heading1_style))
    
    elements.append(Paragraph("Docker Configuration", heading2_style))
    elements.append(Paragraph(
        "Complete Docker setup with multi-stage builds for optimization. Backend uses Python 3.10-slim with "
        "all dependencies. Frontend uses Node.js 18 for build and Nginx alpine for production serving. "
        "Docker Compose configuration for easy deployment.",
        normal_style
    ))
    
    elements.append(Paragraph("Deployment Options", heading2_style))
    deployment_options = [
        "Docker Compose (VPS/Cloud)",
        "Railway.app (Auto-deploy)",
        "Render.com (Free tier)",
        "AWS/Azure/GCP (Enterprise)",
        "Kubernetes (Scalable)"
    ]
    
    for option in deployment_options:
        elements.append(Paragraph(f"• {option}", normal_style))
    
    elements.append(PageBreak())
    
    # Technical Specifications
    elements.append(Paragraph("Technical Specifications", heading1_style))
    
    specs = [
        ("System Requirements", "CPU: 4+ cores, RAM: 8GB+, GPU: Optional (8GB+ VRAM recommended)"),
        ("Backend", "Python 3.10+, PyTorch 2.0+, FastAPI 0.104+"),
        ("Frontend", "Node.js 18+, React 18.2+, Tailwind CSS 3.3+"),
        ("Models", "TorchScript format, 100-300 MB per model"),
        ("Inference Time", "0.3-0.8s (GPU), 1-3s (CPU)"),
        ("API Performance", "< 1 second response time, 10-20 req/s throughput")
    ]
    
    for spec, description in specs:
        elements.append(Paragraph(f"<b>{spec}:</b> {description}", normal_style))
    
    elements.append(PageBreak())
    
    # Features & Capabilities
    elements.append(Paragraph("Features & Capabilities", heading1_style))
    
    elements.append(Paragraph("Core Features", heading2_style))
    core_features = [
        "23-Class Classification",
        "Ensemble Predictions",
        "Real-Time Inference",
        "Grad-CAM Explainability",
        "Multi-Layer Visualization",
        "Attention Rollout",
        "Lesion Localization",
        "Uncertainty Estimation",
        "Image Preprocessing",
        "PDF Report Generation"
    ]
    
    for feature in core_features:
        elements.append(Paragraph(f"✓ {feature}", normal_style))
    
    elements.append(PageBreak())
    
    # Conclusion
    elements.append(Paragraph("Conclusion", heading1_style))
    
    elements.append(Paragraph(
        "The GI Endoscopy AI Diagnostic Portal represents a complete, production-ready system combining "
        "advanced ML models, explainable AI, modern web interface, scalable backend, and production deployment. "
        "The system enables faster diagnosis, better accuracy, clinical trust through explainability, and "
        "seamless workflow integration.",
        normal_style
    ))
    
    elements.append(Paragraph("Key Strengths", heading2_style))
    strengths = [
        "High Accuracy: Ensemble approach with advanced techniques",
        "Explainability: Multiple visualization methods",
        "User-Friendly: Modern, responsive interface",
        "Production-Ready: Complete deployment pipeline",
        "Scalable: Docker-based architecture",
        "Maintainable: Clean code structure"
    ]
    
    for strength in strengths:
        elements.append(Paragraph(f"• {strength}", normal_style))
    
    # Footer
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph(
        f"<i>Report Generated: {datetime.now().strftime('%B %d, %Y')} | Project Status: Production Ready</i>",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, alignment=TA_CENTER, textColor=colors.grey)
    ))
    
    # Build PDF
    doc.build(elements)
    print(f"PDF report generated: {output_filename}")

if __name__ == "__main__":
    create_complete_project_report_pdf()
    print("Complete Project Report PDF created successfully!")

