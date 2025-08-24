import easyocr
import re
import pandas as pd

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

data_list = []

for img_path in image_paths:
    results = reader.readtext(img_path, detail=0)
    text = "\n".join(results)

    aadhaar_number = re.search(aadhaar_pattern, text)
    aadhaar_number = aadhaar_number.group() if aadhaar_number else ""

    name = re.search(name_pattern, text, re.IGNORECASE)
    name = name.group(1).strip() if name else ""

    address = re.search(address_pattern, text, re.IGNORECASE)
    address = address.group(1).strip() if address else ""

    data_list.append({
        "Document Type": "Aadhaar Card",
        "Name": name,
        "Aadhaar Number": aadhaar_number,
        "Address": address
    })

df = pd.DataFrame(data_list)

df['Name'] = df['Name'].str.strip().str.title()
df['Aadhaar Number'] = df['Aadhaar Number'].str.replace(r"\D", "", regex=True)
df['Address'] = df['Address'].str.replace(r'\s+', ' ', regex=True).str.strip()
df['Valid Aadhaar'] = df['Aadhaar Number'].apply(lambda x: len(x) == 12)

def standardize_address(addr):
    if not addr:
        return ""
    # Replace abbreviations
    addr = re.sub(r"\bRd\.?\b", "Road", addr, flags=re.IGNORECASE)
    addr = re.sub(r"\bSt\.?\b", "Street", addr, flags=re.IGNORECASE)
    addr = re.sub(r"\bAve\.?\b", "Avenue", addr, flags=re.IGNORECASE)

    # Remove unwanted special characters except , / - . #
    addr = re.sub(r"[^A-Za-z0-9\s,./#-]", "", addr)

    # Standardize ZIP code to 6-digit format (India)
    addr = re.sub(r"\b(\d{3})\s?(\d{3})\b", r"\1\2", addr)  # removes space inside zip code

    return addr.strip()

df['Address'] = df['Address'].apply(standardize_address)

# -------------------------
# 7️⃣ Save Final Dataset
# -------------------------
output_csv = "final_aadhaar_data.csv"
df[['Name', 'Address', 'Aadhaar Number', 'Document Type']].to_csv(output_csv, index=False, encoding='utf-8')

# Also save JSON
output_json = "final_aadhaar_data.json"
df[['Name', 'Address', 'Aadhaar Number', 'Document Type']].to_json(output_json, orient='records', indent=4)

print(f"Final standardized dataset saved to '{output_csv}' and '{output_json}'")
print(df[['Name', 'Address', 'Aadhaar Number', 'Document Type']])