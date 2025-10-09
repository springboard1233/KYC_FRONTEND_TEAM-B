import pandas as pd

df = pd.read_csv("extracted_aadhaar_data.csv")

df['Name'] = df['Name'].str.strip().str.title()
df['Aadhaar Number'] = df['Aadhaar Number'].str.replace(r"\D", "", regex=True)
df['Address'] = df['Address'].str.replace(r'\s+', ' ', regex=True).str.strip()
df['Valid Aadhaar'] = df['Aadhaar Number'].apply(lambda x: len(x) == 12)

df.to_csv("cleaned_aadhaar_data.csv", index=False, encoding='utf-8')

print("✅ Cleaned data saved to 'cleaned_aadhaar_data.csv'")
print(df)
