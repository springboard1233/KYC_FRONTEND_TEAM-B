import easyocr
import re
import csv

# List of 5 sample images
image_paths = [
    "aadhaar_sample_1.png",
    "aadhaar_sample_2.png",
    "aadhaar_sample_3.png",
    "aadhaar_sample_4.png",
    "aadhaar_sample_5.png"
]

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Define regex patterns
aadhaar_pattern = r"\b\d{4}\s\d{4}\s\d{4}\b"
name_pattern = r"Name[:\s]*([A-Z ]+)"
address_pattern = r"Address[:\s]*([A-Za-z0-9/.,\-\s]+?\d{6})"

# Prepare CSV file
csv_file = "extracted_aadhaar_data.csv"
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=["Name", "Aadhaar Number", "Address", "Document Type"])
    writer.writeheader()

    # Process each image
    for i, img_path in enumerate(image_paths, start=1):
        results = reader.readtext(img_path, detail=0)
        text = "\n".join(results)

        # Extract Aadhaar Number
        aadhaar_number = re.search(aadhaar_pattern, text)
        aadhaar_number = aadhaar_number.group() if aadhaar_number else "Not Found"

        # Extract Name
        name = re.search(name_pattern, text, re.IGNORECASE)
        name = name.group(1).strip() if name else "Not Found"

        # Extract Address
        address = re.search(address_pattern, text, re.IGNORECASE)
        address = address.group(1).strip() if address else "Not Found"

        # Set Document Type (since all are Aadhaar cards)
        document_type = "Aadhaar Card"

        # Write to CSV
        writer.writerow({
            "Name": name,
            "Aadhaar Number": aadhaar_number,
            "Address": address,
            "Document Type": document_type
        })

        print(f"\n--- Fields from Document {i} ---")
        print(f"Name: {name}")
        print(f"\nAadhaar Number: {aadhaar_number}")
        print(f"\nAddress: {address}")
        print(f"\nDocument Type: {document_type}")

print(f"\nAll extracted data has been saved to '{csv_file}'")