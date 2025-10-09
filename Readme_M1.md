# Milestone 1 – Data Collection & Preprocessing

## Steps Completed
1. Generated fake Aadhaar samples (5 images) → data/raw/
2. OCR extraction → extracted_aadhaar_data.csv
3. Data cleaning → cleaned_aadhaar_data.csv
4. Standardization → final_aadhaar_data.csv, final_aadhaar_data.json


# Milestone 1 – Aadhaar KYC Data Pipeline

## 📌 Overview
Milestone 1 focuses on building the basic pipeline for Aadhaar KYC data processing.  
The flow includes generating fake Aadhaar images, extracting data using OCR, cleaning the extracted text, and standardizing the final output.

---

## 🚀 Workflow Steps

### 1️⃣ Generate Fake Aadhaar (Images)
- Description: Create sample Aadhaar card images for testing.
- Input: N/A (manually created or generated)
- Output: Fake Aadhaar card images (.jpg/.png)

---

### 2️⃣ OCR Extraction
- File: ocr_extract.py  
- Description: Runs OCR (EasyOCR) on the Aadhaar image and extracts text.
- Output File:  
  - extracted-aadhar-data.csv (saved in the same folder)

---

### 3️⃣ Data Cleaning
- File: data_clean.py  
- Description: Cleans the extracted text by removing noise, fixing formatting, and correcting spelling errors.
- Output File:  
  - cleaned-aadhar-data.csv

---

### 4️⃣ Standardization
- File: standardize.py  
- Description: Standardizes Aadhaar data into a structured format (CSV + JSON).
- Output Files:  
  - final-aadhar-data.csv  
  - final-aadhar-data.json

---

## Tools
Python, EasyOCR, Faker, Pillow, Pandas, Regex

---

## How to Run
```bash
cd src
python 01_generate_samples.py
python 02_ocr_extract.py
python 03_clean.py
python 04_standardize.py
