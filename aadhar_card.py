
from faker import Faker
from PIL import Image, ImageDraw, ImageFont
import random

fake = Faker("en_IN")

def generate_fake_aadhar_data():
    """Generate random Aadhaar-like fake data"""
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

def create_aadhar_card_image(data, filename="aadhaar_style.png", theme_color=(255,255,255)):
    """Draws Aadhaar-style card and saves as PNG"""
    img = Image.new("RGB", (950, 600), color=theme_color)
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arial.ttf", 24)
        bold_font = ImageFont.truetype("arialbd.ttf", 34)
    except:
        font = ImageFont.load_default()
        bold_font = font

    draw.rectangle([0, 0, 950, 50], fill=(255, 153, 51)) 
    draw.rectangle([0, 50, 950, 100], fill=(255, 255, 255))  
    draw.rectangle([0, 100, 950, 150], fill=(19, 136, 8))  

    draw.text((360, 160), "Government of India", font=bold_font, fill="black")

    draw.ellipse([800, 20, 900, 120], outline="red", width=3)
    draw.text((815, 60), "Logo", font=font, fill="red")

    gender_color = (150, 200, 255) if data["Gender"] == "Male" else (255, 200, 220)
    draw.rectangle([50, 220, 230, 400], fill=gender_color, outline="black", width=2)
    draw.text((110, 300), "Photo", font=font, fill="black")

    draw.text((280, 230), f"Name: {data['Name']}", font=font, fill="black")
    draw.text((280, 270), f"DOB: {data['DOB']}", font=font, fill="black")
    draw.text((280, 310), f"Gender: {data['Gender']}", font=font, fill="black")


    draw.text((280, 370), data['Aadhaar Number'], font=bold_font, fill="black")

    draw.rectangle([40, 420, 910, 510], outline="black", width=2)
    draw.text((50, 430), f"Address: {data['Address']}", font=font, fill="black")

    taglines = [
        "Mera Aadhaar, Meri Pehchaan",
        "Your Identity, Your Aadhaar",
        "Aadhaar - Empowering Residents",
        "Digital India with Aadhaar",
        "Identity Made Simple"
    ]
    draw.text((280, 550), random.choice(taglines), font=bold_font, fill="red")

    img.save(filename)
    print(f"Aadhaar-style card saved as {filename}")

themes = [(255,255,255), (245,245,250), (250,255,240), (255,248,220), (240,255,255)]

for i in range(1, 6):
    fake_data = generate_fake_aadhar_data()
    create_aadhar_card_image(fake_data, filename=f"aadhaar_sample_{i}.png", theme_color=themes[i-1])
