"""Вырезает фон у одного изображения: cut_one.py <in> <out>."""
import sys
from rembg import remove, new_session
from PIL import Image

inp, outp = sys.argv[1], sys.argv[2]
session = new_session("u2net")
img = Image.open(inp).convert("RGBA")
out = remove(img, session=session)
out.save(outp)
print("OK", outp)
