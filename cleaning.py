import os
import re

input_folder = "ocr_texts"
output_folder = "cleaned_texts"

os.makedirs(ouput_folder,exist_ok=True)
aadhaar_pattern = re.compile(r"\b\d{4}\s\d{4}\s\d{4}\b")

for i in range(1, 6):  
    input_file = os.path.join(input_folder, f"aadhaar_text_{i}.txt")
    output_file = os.path.join(output_folder, f"aadhaar_cleaned_{i}.txt")

    if not os.path.exists(input_file):
        print(f"❌ File not found: {input_file}")
        continue

    with open(input_file, "r", encoding="utf-8") as f:
        text = f.read()


    text = re.sub(r"\s+", " ", text)

    text = aadhaar_pattern.sub(lambda x: "XXXX XXXX " + x.group()[-4:], text)


    with open(output_file, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"Cleaned file saved: {output_file}")
