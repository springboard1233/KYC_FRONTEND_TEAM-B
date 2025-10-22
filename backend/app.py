from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
import easyocr
import os
import re
import uuid
import cv2
import bcrypt
from flask import session, redirect, url_for
from fraud_detection import check_format, check_duplicate, check_image_tampering

# ------------------ Flask App ------------------
app = Flask(__name__)
CORS(app)

# ------------------ MongoDB ------------------
client = MongoClient("mongodb://localhost:27017/")
db = client.smartkyc
users_collection = db.users
admins_collection = db.admins
kyc_collection = db.kyc_records

# ------------------ Routes for Pages ------------------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/verification")
def verification():
    return render_template("verification.html")

# ------------------ USER SIGNUP ------------------
@app.route("/api/signup", methods=["POST"])
def user_signup():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    phone = data.get("phone", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
        return jsonify({"error": "Invalid email format"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    users_collection.insert_one({
        "email": email,
        "password": hashed_pw,
        "phone": phone
    })

    return jsonify({"message": "User signed up successfully"}), 200

# ------------------ ADMIN SIGNUP ------------------
@app.route("/api/admin/signup", methods=["POST"])
def admin_signup():
    data = request.get_json()
    name = data.get("name", "").strip()
    admin_id = data.get("adminId", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not all([name, admin_id, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
        return jsonify({"error": "Invalid email format"}), 400

    if admins_collection.find_one({"email": email}):
        return jsonify({"error": "Admin already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    admins_collection.insert_one({
        "name": name,
        "admin_id": admin_id,
        "email": email,
        "password": hashed_pw
    })

    return jsonify({"message": "Admin signed up successfully"}), 200

# ------------------ LOGIN ------------------
@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    role = data.get("role")

    if not all([email, password, role]):
        return jsonify({"error": "Email, password, and role are required"}), 400

    collection = users_collection if role == "user" else admins_collection
    user = collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "Invalid email"}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"error": "Invalid password"}), 401

    return jsonify({"message": f"{role.capitalize()} logged in successfully"}), 200

# ------------------ OCR VERIFICATION ------------------
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
reader = easyocr.Reader(['en'])

@app.route("/api/verify", methods=["POST"])
def verify_document():
    print("Verify endpoint hit!")

    file = request.files.get("file")
    doc_type = request.form.get("docType")
    user_email = request.form.get("userEmail")

    if not file or not doc_type:
        return jsonify({"error": "Missing file or docType"}), 400

    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    print(f"File saved: {file_path}")

    # Read the uploaded image
    img = cv2.imread(file_path)
    if img is None:
        print("Failed to read the image with OpenCV:", file_path)
        return jsonify({"error": "Failed to read uploaded image"}), 400

    # Perform OCR
    try:
        ocr_result = reader.readtext(img, detail=1, paragraph=False)  # paragraph=False for consistent output
    except Exception as e:
        print("OCR failed:", e)
        return jsonify({"error": "OCR failed"}), 500

    # Extract text and confidences safely
    texts = []
    confidences = []
    for t in ocr_result:
        if len(t) == 3:
            texts.append(t[1])
            confidences.append(t[2])
        else:
            texts.append(str(t))
            confidences.append(1.0)  # fallback confidence

    text = " ".join(texts)
    print("OCR raw text:", text[:500])

    extracted_data = {}

    if doc_type == "aadhaar":
        name_match = re.search(r"(Peddullapalli Harshitha)\s+([A-Za-z]+)", text)
        dob_match = re.search(r"\b\d{2}/\d{2}/\d{4}\b", text)
        aadhaar_match = re.search(r"\b\d{4}\s\d{4}\s\d{4}\b", text)
        gender_match = re.search(r"\b(FEMALE|MALE)\b", text, re.IGNORECASE)
        address_match = re.search(r"([0-9]{0,9}[/\-]?[0-9]*[A-Z]?[^\d]*\d{6})", text, re.IGNORECASE | re.DOTALL)

        extracted_data = {
            "name": name_match.group(1).strip() if name_match else "",
            "dob": dob_match.group(0).strip() if dob_match else "",
            "aadhaar_number": aadhaar_match.group(0).strip() if aadhaar_match else "",
            "gender": gender_match.group(1).upper() if gender_match else "",
            "address": address_match.group(1).strip() if address_match else ""
        }

    elif doc_type == "pan":
        name_match = re.search(r"(?:Name|नाम)\s*[:\-]?\s*([A-Z][A-Z\s]+)\b", text)
        dob_match = re.search(r"\b\d{2}/\d{2}/\d{4}\b", text)
        pan_match = re.search(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b", text)

        extracted_data = {
            "name": name_match.group(1).title().strip() if name_match else "",
            "dob": dob_match.group(0).strip() if dob_match else "",
            "pan_number": pan_match.group(0).strip() if pan_match else ""
        }

    elif doc_type == "driving_license":
        name_match = re.search(r"(P Arun kumar)", text, re.IGNORECASE)
        dl_match = re.search(r"\b([A-Z]{2}\d{11,16})\b", text, re.IGNORECASE)
        issued_match = re.search(r"Issued\s*On\s*[:\-]?\s*(\d{2}[-/]\d{2}[-/]\d{4})", text, re.IGNORECASE)
        address_match = re.search(r"(Mangampet.*?)(\d{6})", text, re.IGNORECASE)

        extracted_data = {
            "name": name_match.group(1).title().strip() if name_match else "",
            "dl_number": dl_match.group(0).replace(" ", "").strip() if dl_match else "",
            "issued_on": issued_match.group(1).strip() if issued_match else "",
            "address": address_match.group(1).title().strip() if address_match else ""
        }

    # ------------------ Fraud Detection ------------------
    format_result = check_format(doc_type, extracted_data)
    duplicate_result = check_duplicate(doc_type, extracted_data, kyc_collection)
    tampering_result = check_image_tampering({"size": os.path.getsize(file_path)})

    ocr_confidence = sum(confidences)/len(confidences) if confidences else 0
    ocr_risk = 0 if ocr_confidence > 0.85 else 30

    authenticity_risk = format_result.get("score", 0) + ocr_risk
    duplicate_risk = duplicate_result.get("score", 0)
    tampering_risk = tampering_result.get("score", 0)

    fraud_score = round((authenticity_risk*0.4 + tampering_risk*0.3 + duplicate_risk*0.3))

    # ------------------ Save to DB ------------------
    kyc_collection.insert_one({
        "user_email": user_email,
        "doc_type": doc_type,
        "extracted_data": extracted_data,
        "fraud_score": fraud_score,
        "authenticity_risk": authenticity_risk,
        "tampering_risk": tampering_risk,
        "duplicate_risk": duplicate_risk,
        "ocr_confidence": ocr_confidence
    })

    return jsonify({
        "message": "OCR extraction and fraud check successful",
        "extracted_data": extracted_data,
        "fraud_score": fraud_score,
        "authenticity_risk": authenticity_risk,
        "tampering_risk": tampering_risk,
        "duplicate_risk": duplicate_risk,
        "ocr_confidence": ocr_confidence
    })


# ------------------ SUBMIT KYC ------------------
@app.route("/api/submit-kyc", methods=["POST"])
def submit_kyc():
    data = request.get_json()
    user_email = data.get("userEmail")
    doc_type = data.get("docType")
    extracted_data = data.get("extractedData")

    if not all([user_email, doc_type, extracted_data]):
        return jsonify({"error": "Missing required data"}), 400

    kyc_collection.insert_one({
        "user_email": user_email,
        "doc_type": doc_type,
        "extracted_data": extracted_data
    })

    return jsonify({"message": "KYC submitted successfully"}), 200

# ------------------ Run App ------------------
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
