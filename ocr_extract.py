import easyocr
import re
import csv

# Aadhaar sample images already in same folder
image_paths = [
    "aadhaar_sample_1.png",
    "aadhaar_sample_2.png",
    "aadhaar_sample_3.png",
    "aadhaar_sample_4.png",
    "aadhaar_sample_5.png"
]

reader = easyocr.Reader(['en'])

aadhaar_pattern = r"\b\d{4}\s\d{4}\s\d{4}\b"
name_pattern = r"Name[:\s]*([A-Z ]+)"
address_pattern = r"Address[:\s]*([A-Za-z0-9/.,\-\s]+?\d{6})"

csv_file = "extracted_aadhaar_data.csv"
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=["Name", "Aadhaar Number", "Address", "Document Type"])
    writer.writeheader()

    for i, img_path in enumerate(image_paths, start=1):
        results = reader.readtext(img_path, detail=0)
        text = "\n".join(results)

        aadhaar_number = re.search(aadhaar_pattern, text)
        aadhaar_number = aadhaar_number.group() if aadhaar_number else "Not Found"

        name = re.search(name_pattern, text, re.IGNORECASE)
        name = name.group(1).strip() if name else "Not Found"

        address = re.search(address_pattern, text, re.IGNORECASE)
        address = address.group(1).strip() if address else "Not Found"

        writer.writerow({
            "Name": name,
            "Aadhaar Number": aadhaar_number,
            "Address": address,
            "Document Type": "Aadhaar Card"
        })

        print(f"\n--- Fields from Document {i} ---")
        print(f"Name: {name}")
        print(f"Aadhaar Number: {aadhaar_number}")
        print(f"Address: {address}")

print(f"\nAll extracted data has been saved to '{csv_file}'")
