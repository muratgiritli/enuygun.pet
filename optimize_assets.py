import os
from PIL import Image, ImageOps

raw = "/build/raw_assets"
out = "/build/public"
os.makedirs(f"{out}/img", exist_ok=True)

# 1. Google SERP-compliant multi-size favicons (multiples of 48px + .ico + Apple + Android PWA icons)
fav = Image.open(f"{raw}/favicon.png").convert("RGBA")
fav.resize((32, 32), Image.LANCZOS).save(f"{out}/favicon.png", format="PNG", optimize=True)
fav.resize((48, 48), Image.LANCZOS).save(f"{out}/favicon-48.png", format="PNG", optimize=True)
fav.resize((96, 96), Image.LANCZOS).save(f"{out}/favicon-96.png", format="PNG", optimize=True)
fav.resize((180, 180), Image.LANCZOS).save(f"{out}/apple-touch-icon.png", format="PNG", optimize=True)
fav.resize((180, 180), Image.LANCZOS).save(f"{out}/apple-touch-icon-precomposed.png", format="PNG", optimize=True)
fav.resize((192, 192), Image.LANCZOS).save(f"{out}/favicon-192.png", format="PNG", optimize=True)
fav.resize((512, 512), Image.LANCZOS).save(f"{out}/icon-512.png", format="PNG", optimize=True)
fav.save(f"{out}/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

# 2. Hero image: responsive WebP (520w, 880w) + quantized PNG fallback
hero = Image.open(f"{raw}/img/hero-pets.png").convert("RGBA")
w, h = hero.size
hero_h_880 = round(h * (880 / w))
for target_w in (520, 880):
    target_h = round(h * (target_w / w))
    resized = hero.resize((target_w, target_h), Image.LANCZOS)
    resized.save(f"{out}/img/hero-pets-{target_w}.webp", format="WEBP", quality=82, method=6)
    if target_w == 880:
        resized.quantize(colors=256, method=Image.FASTOCTREE).save(
            f"{out}/img/hero-pets.png", format="PNG", optimize=True
        )

# Stamp exact intrinsic height into index.html for 0.000 CLS
for fn in os.listdir(out):
    if fn.endswith(".html"):
        hp = os.path.join(out, fn)
        ht = open(hp, "r", encoding="utf-8").read()
        if "__HERO_H880__" in ht:
            open(hp, "w", encoding="utf-8").write(ht.replace("__HERO_H880__", str(hero_h_880)))

# 3. Social / Google Rich Result Images (1200x630 1.91:1 OG + 1200x900 4:3 + 800x800 1:1 for LocalBusiness Schema)
def make_card(cw, ch, out_name):
    canvas = Image.new("RGB", (cw, ch), (247, 251, 251))
    copy_im = hero.copy()
    copy_im.thumbnail((int(cw * 0.9), int(ch * 0.88)), Image.LANCZOS)
    canvas.paste(copy_im, ((cw - copy_im.width) // 2, (ch - copy_im.height) // 2), copy_im)
    canvas.save(f"{out}/img/{out_name}", format="JPEG", quality=82, optimize=True, progressive=True)

make_card(1200, 630, "og-share.jpg")
make_card(1200, 900, "store-4x3.jpg")
make_card(800, 800, "store-1x1.jpg")

# 4. Category thumbnails (240x240 WebP + JPEG fallback)
for name in ("cat", "dog", "bird", "hamster", "fish"):
    im = Image.open(f"{raw}/img/{name}.jpg").convert("RGB")
    thumb = ImageOps.fit(im, (240, 240), method=Image.LANCZOS)
    thumb.save(f"{out}/img/{name}.webp", format="WEBP", quality=80, method=6)
    thumb.save(f"{out}/img/{name}.jpg", format="JPEG", quality=82, optimize=True, progressive=True)
