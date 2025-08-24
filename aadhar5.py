from faker import Faker
from PIL import Image, ImageDraw, ImageFont
import random

fake = Faker("en_IN")

def generate_fake_aadhar_data():
    aadhaar_number = " ".join(
        ["".join([str(random.randint(0, 9)) for _ in range(4)]) for _ in range(3)]
    )
    return {
        "Name": fake.name(),
        "Gender": random.choice(["Male", "Female"]),
        "DOB": fake.date_of_birth(minimum_age=18, maximum_age=90).strftime("%d-%m-%Y"),
        "Aadhaar Number": aadhaar_number,
        "Address": fake.address().replace("\n", ", "),
    }

def create_aadhar_card_image(data, filename="aadhaar_style.png"):
    img = Image.new("RGB", (900, 600), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arial.ttf", 22)
        big_font = ImageFont.truetype("arialbd.ttf", 32)
    except:
        font = ImageFont.load_default()
        big_font = font

    # Indian flag colors
    draw.rectangle([0, 0, 900, 50], fill=(255, 153, 51))  # saffron
    draw.rectangle([0, 50, 900, 100], fill=(255, 255, 255))  # white
    draw.rectangle([0, 100, 900, 150], fill=(19, 136, 8))  # green

    draw.text((350, 160), "Government of India", font=big_font, fill="black")

    # Placeholder for photo
    draw.rectangle([50, 200, 250, 400], outline="black", width=3)
    draw.text((110, 290), "Photo", font=font, fill="gray")

    # Personal details
    draw.text((300, 220), f"Name: {data['Name']}", font=font, fill="black")
    draw.text((300, 260), f"DOB: {data['DOB']}", font=font, fill="black")
    draw.text((300, 300), f"Gender: {data['Gender']}", font=font, fill="black")
    draw.text((300, 360), data["Aadhaar Number"], font=big_font, fill="black")
    draw.text((50, 430), f"Address: {data['Address']}", font=font, fill="black")

    # Tagline
    draw.text((300, 550), "Mera Aadhaar, Meri Pehchaan", font=big_font, fill="red")

    img.save(filename)
    print(f"Saved Aadhaar-style card: {filename}")


# Generate 5 samples
for i in range(1, 6):
    fake_data = generate_fake_aadhar_data()
    create_aadhar_card_image(fake_data, filename=f"aadhaar_sample_{i}.png")