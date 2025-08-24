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

reader = easyocr.Reader(['en'])  # OCR reader

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
         
        "Name": name,
        "Aadhaar Number": aadhaar_number,
        "Address": address,
        "Document Type": "Aadhaar Card"
    })

df = pd.DataFrame(data_list)

df['Name'] = df['Name'].str.strip().str.title()
df['Aadhaar Number'] = df['Aadhaar Number'].str.replace(r"\D", "", regex=True)
df['Address'] = df['Address'].str.replace(r'\s+', ' ', regex=True).str.strip()
df['Valid Aadhaar'] = df['Aadhaar Number'].apply(lambda x: len(x) == 12)

output_csv = "cleaned_aadhaar_data.csv"
df.to_csv(output_csv, index=False, encoding='utf-8')

print(f"All data extracted and cleaned successfully! Saved to '{output_csv}'")
print(df)