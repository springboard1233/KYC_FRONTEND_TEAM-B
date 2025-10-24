
from PIL import Image
import os

image_paths = [f"aadhaar_sample_{i}.png" for i in range(1, 6)]

os.makedirs("ocr_texts", exist_ok=True)

for i, img in enumerate(image_paths, 1):
    try:
        Image.open(img)

        dummy_text = f"[Dummy OCR Output] Extracted text from {img}"
        
        with open(f"ocr_texts/aadhaar_text_{i}.txt", "w", encoding="utf-8") as f:
            f.write(dummy_text)

        print(f"Fake OCR extracted from {img} → saved to aadhaar_text_{i}.txt")
    except Exception as e:
        print(f"Failed to process {img} → {e}")
