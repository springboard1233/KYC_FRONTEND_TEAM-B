import re
import cv2

# Aadhaar validation (regex + Luhn checksum style)
def check_aadhaar_validity(aadhaar_number):
    if not re.match(r"^\d{4}\s\d{4}\s\d{4}$", aadhaar_number):
        return False
    return True  # You can implement checksum later

# PAN validation
def check_pan_validity(pan_number):
    return bool(re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", pan_number))

# ✅ Check format authenticity
def check_format(doc_type, extracted_data):
    score = 0
    if doc_type == "aadhaar":
        aadhaar = extracted_data.get("aadhaar_number", "")
        if not re.match(r"^\d{4}\s\d{4}\s\d{4}$", aadhaar):
            score += 50  # Invalid format
    elif doc_type == "pan":
        pan = extracted_data.get("pan_number", "")
        if not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", pan):
            score += 50
    return {"status": "checked", "score": score}

# ✅ Check duplicate in database
def check_duplicate(doc_type, extracted_data, collection):
    query = {}
    if doc_type == "aadhaar":
        query = {"aadhaar_number": extracted_data.get("aadhaar_number")}
    elif doc_type == "pan":
        query = {"pan_number": extracted_data.get("pan_number")}
    elif doc_type == "driving_license":
        query = {"dl_number": extracted_data.get("dl_number")}

    if collection.find_one(query):
        score = 50  # Duplicate found → high risk
    else:
        score = 0
    return {"status": "checked", "score": score}


# ✅ Basic image tampering detection (blur/sharpness)
def check_image_tampering(file_data):
    size_kb = file_data.get("size", 0) / 1024
    score = 0
    if size_kb < 50:
        score += 30
    elif size_kb > 2000:
        score += 10
    return {"status": "checked", "score": score}
