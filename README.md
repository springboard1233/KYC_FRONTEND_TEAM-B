# AI-Powered Identity Verification and Fraud Detection for KYC.

# KYC_FRONTEND_TEAM-B

Build a smart AI system that:

Verifies customer identity using documents like Aadhaar.

Detects fraud, especially fake or mismatched addresses.

Ensures banks comply with KYC and AML rules.

Reduces manual verification efforts.

## Technologies Involved:
NLP (via Azure OpenAI): Read and understand text on documents.

Computer Vision: Check document layout, format, and tampering.

GNN (Graph Neural Networks): Spot fake identities by analyzing relationships between data points.

Azure or Local Deployment: Secure deployment and compliance-ready logging.


Tasks:
Containerize models using Docker (intro level).

Use synthetic Aadhaar data to validate system.

Build a report: number of frauds flagged, accuracy, false positives, etc.

If Azure is used, test model deployment via Azure ML or App Services.

##Tools & Stack Suggestions :-

OCR: Tesseract, EasyOCR

NLP: Azure OpenAI, LangChain, HuggingFace Transformers

CV: OpenCV, CNN (ResNet)

GNN: PyTorch Geometric / DGL

Backend: Flask or FastAPI

Deployment: Docker + Streamlit (optional UI)

Data: Synthetic Aadhaar/Utility docs or sample KYC data

Version Control: Git + GitHub for collaboration

## Suggested Folder Structure :-

project_root/
│
├── data/
│   ├── raw_docs/
│   ├── processed_data.csv
│
├── ocr/
│   ├── ocr_extractor.py
│   └── field_extractor.py
│
├── utils/
│   └── cleaning_utils.py
│
├── README.md
└── requirements.txt


