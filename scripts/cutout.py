"""Удаляет фон у фото товаров → прозрачные PNG в public/products/cut/.
Прототип фото-пайплайна (rembg). Студию/услуги не трогаем — там сцены."""
import os
from rembg import remove, new_session
from PIL import Image

SRC = "public/products"
DST = "public/products/cut"
os.makedirs(DST, exist_ok=True)

NAMES = ["grace", "hoodie", "ichthys", "pax", "lumen",
         "sol", "cap", "tote", "bracelet", "pendant"]

session = new_session("u2net")
for n in NAMES:
    src = os.path.join(SRC, f"{n}.png")
    img = Image.open(src).convert("RGBA")
    out = remove(img, session=session)
    out.save(os.path.join(DST, f"{n}.png"))
    print("cut:", n)
print("ALL DONE")
