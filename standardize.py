import pandas as pd
import re

df = pd.read_csv("cleaned_aadhaar_data.csv")

def standardize_address(addr):
    if not addr:
        return ""
    addr = re.sub(r"\bRd\.?\b", "Road", addr, flags=re.IGNORECASE)
    addr = re.sub(r"\bSt\.?\b", "Street", addr, flags=re.IGNORECASE)
    addr = re.sub(r"\bAve\.?\b", "Avenue", addr, flags=re.IGNORECASE)
    addr = re.sub(r"[^A-Za-z0-9\s,./#-]", "", addr)
    addr = re.sub(r"\b(\d{3})\s?(\d{3})\b", r"\1\2", addr)
    return addr.strip()

df['Address'] = df['Address'].apply(standardize_address)

# Save final CSV + JSON
df[['Name', 'Address', 'Aadhaar Number', 'Document Type']].to_csv("final_aadhaar_data.csv", index=False, encoding='utf-8')
df[['Name', 'Address', 'Aadhaar Number', 'Document Type']].to_json("final_aadhaar_data.json", orient='records', indent=4)

print("✅ Final standardized dataset saved as 'final_aadhaar_data.csv' and 'final_aadhaar_data.json'")
print(df[['Name', 'Address', 'Aadhaar Number', 'Document Type']])
