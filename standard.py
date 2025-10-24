
import pandas as pd
import re

df = pd.read_csv("extracted_cleaned_data.csv")

def standardize_address(addr):
    if not addr:
        return ""
    addr = re.sub(r"\bRd\b", "Road", addr, flags=re.IGNORECASE)
    addr = re.sub(r"\bSt\b", "Street", addr, flags=re.IGNORECASE)
    addr = re.sub(r"\bAve\b", "Avenue", addr, flags=re.IGNORECASE)
    addr = re.sub(r"\s+", " ", addr) 
    addr = re.sub(r"[^A-Za-z0-9\s,./#-]", "", addr) 
    return addr.strip()

df["Address"] = df["Address"].apply(standardize_address)
df["Valid Aadhaar"] = df["Aadhaar Number"].apply(lambda x: len(str(x)) == 12)


df.to_csv("final_aadhaar_data.csv", index=False, encoding="utf-8")
df.to_json("final_aadhaar_data.json", orient="records", indent=4)

print("Final standardized dataset saved as CSV + JSON")
print(df)
